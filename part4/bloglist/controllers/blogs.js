
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    response.status(200).json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const token = request.token
  if(token === null || typeof(token) === 'undefined') {
    return response.status(401).json({ error: 'token is not provided' })
  }

  const body = request.body

  const userid = request.user
  if (!userid) {
    return response.status(401).json({ error: 'user is invalid' })
  }
  const user = await User.findById(userid)

  if (!user) {
    return response.status(401).json({ error: 'user is invalid' })
  }

  const blog = new Blog({ ...body, user: user.id })

  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).end()
  } else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  if (request.token === null) {
    return response.status(401).json({ error: 'token is required for deletion' })
  }
  const userid = request.user

  if (!userid) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blogexists = await Blog.findById(request.params.id)

  if (blogexists) {
    if (blogexists.user.toString() === userid.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'invalid user' })
    }
  } else {
    response.status(404).end()
  }
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  const blogexists = await Blog.findById(request.params.id)

  if (blogexists) {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogRouter