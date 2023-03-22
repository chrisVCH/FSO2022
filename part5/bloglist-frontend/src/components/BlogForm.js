import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    createBlog(blogObject)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id='title'
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            placeholder='blog title'
          />
        </div>
        <div>
            author:
          <input
            id='author'
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
            placeholder='blog author'
          />
        </div>
        <div>
            url:
          <input
            id='url'
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            placeholder='blog url'
          />
        </div>
        <button id='create-button' type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm