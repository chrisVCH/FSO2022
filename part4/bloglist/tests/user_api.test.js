const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)
const helper = require('./test_helper')
const mongoose = require('mongoose')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('when there is initially one user in db', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'cchen',
      name: 'Chris Chen',
      password: 'salution'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  describe('when trying to create invalid user', () => {
    test('creation fails if username is not given', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        name: 'QA tester 1',
        password: 'QAtest'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(401)

      expect(result.body.error).toContain('both username and password must be given')
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails if password is not given', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'QA tester',
        name: 'QA tester 1'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(401)

      expect(result.body.error).toContain('both username and password must be given')
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails if username is less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'QA',
        name: 'QA tester 1',
        password: 'QA123'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(401)

      expect(result.body.error).toContain('username must be at least 3 characters')
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails if password is less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'QAq233',
        name: 'QA tester 1',
        password: 'GA'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(401)

      expect(result.body.error).toContain('password must be at least 3 characters')
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
