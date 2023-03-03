const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

jest.setTimeout(30000)
//global object for storing auth information
var auth = {}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const res1 = await api
    .post('/api/users')
    .send({
      username: 'test',
      name: 'test',
      password: 'secret'
    })
  auth.user_id = res1.body.id

  const res2 = await api
    .post('/api/login')
    .send({
      username: 'test',
      password: 'secret'
    })
  auth.token = res2.body.token

  const testedBlogs = helper.initialBlogs.map(b => ({ ...b, user: `${auth.user_id}` }))
  await Blog.insertMany(testedBlogs)

})

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(titles).toContain(
      'Canonical string reduction'
    )
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body.toString()).toEqual(blogToView.toString())
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('verifying property', () => {
  test('Unique identifier property of the blog post is named id', async () => {
    const response = await api.get('/api/blogs')

    const ids = (response.body).map(r => r.id)
    expect(ids).toBeDefined()
    const _ids = (response.body).map(r => r._id)
    expect(_ids).toBeDefined(undefined)

  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added by valid user with token provided', async () => {
    const newBlog = {
      title: 'First class tests added',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      user: auth.user_id
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${auth.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(
      'First class tests added'
    )
  })

  test('a valid blog can not be added if no token is provided', async () => {
    const newBlog = {
      title: 'First class tests added',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      user: auth.user_id
    }
    const res = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    expect(res.body.error).toBe('token is not provided')

    const response = await api.get('/api/blogs')
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
    expect(titles).not.toContain(
      'First class tests added'
    )
  })

  test('blog missing likes in property is added with its default value zero', async () => {
    const newBlog = {
      title: 'TDD harms architecture added',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      user: auth.user_id
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${auth.token}`)
      .send(newBlog)
      .expect(201)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length+1)
    expect(response.body[helper.initialBlogs.length].likes).toBe(0)
  })

  test('blog missing url property is not added to the database', async () => {
    const newBlog = {
      title: 'Blog missing url property',
      author: 'QA tester 1',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${auth.token}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)

  })
})

describe('deletion of a blog', () => {
  test('succeed if user is the owner who added the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${auth.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(t => t.title)
    expect(titles).not.toContain(blogToDelete.title)

  })

  test('fail if user is not the owner who added the blog', async () => {
    await api
      .post('/api/users')
      .send({
        username: 'test2',
        name: 'test2',
        password: 'secret2'
      })

    const response = await api
      .post('/api/login')
      .send({
        username: 'test2',
        password: 'secret2'
      })
    const anothertoken = response.body.token

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${anothertoken}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )

    const titles = blogsAtEnd.map(t => t.title)
    expect(titles).toContain(blogToDelete.title)

  })


  test('fails with delete if id is not valid', async () => {

    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${auth.token}`)
      .expect(400)
  })

  test('fails with delete if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .set('Authorization', `Bearer ${auth.token}`)
      .expect(404)
  })
})

describe('update a blog', () => {
  test('succeed with update on likes if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const blogInfo = { ...blogToUpdate, likes: 100 }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )

    const likes = blogsAtEnd.map(t => t.likes)
    expect(likes[0]).toBe(blogInfo.likes)

  })

  test('fails with update on likes if id is not valid', async () => {

    const invalidId = '5a3d5da59070081a82a3445'
    const blogInfo = {
      title: 'Blog added for test',
      author: 'QA tester 3',
      url: 'wwww.fakeurl.com',
      likes: 0
    }

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(blogInfo)
      .expect(400)

  })

  test('fails with update on likes if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    const blogInfo = {
      title: 'Blog added for test 2',
      author: 'QA tester 4',
      url: 'wwww.fakeurlagain.com',
      likes: 0
    }
    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send(blogInfo)
      .expect(404)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})