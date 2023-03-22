const router = require('express').Router()

const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')


router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

router.post('/', userExtractor, async (request, response) => {
  
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  
  const blog = new Blog({ ...request.body, user: user.id })
  const addedBlog = await blog.populate('user', { username: 1, name: 1 })

  const savedBlog = await addedBlog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

router.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  
  const blogToDelete = await Blog.findById(request.params.id)
  
  if (!blogToDelete) {
    return response.status(204).end()
  }

  if ( blogToDelete.user && blogToDelete.user.toString() !== user.id.toString() ) {
    return response.status(401).json({
      error: 'only the creator can delete a blog'
    })
  }

  await Blog.findByIdAndRemove(request.params.id)
  user.blogs = user.blogs.filter(b => b.toString() !== blogToDelete.id.toString())

  await user.save()

  response.status(204).end()
})

router.put('/:id', async (request, response) => {
  const blog = request.body

  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id, 
      blog, 
      { new: true, runValidators: true, context: 'query' }
    )
      
  response.json(updatedBlog)
})

module.exports = router