import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLikes, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderwidth: 1,
    marginBottom: 5
  }

  const [blogview, setBlogview] = useState('view')

  const userObject = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))

  const likes = blog.likes ? blog.likes: 0

  const isRemovable = blog.user.username === userObject.username ? true : false

  const toggleView = () => {
    const updview = blogview === 'hide' ? 'view' : 'hide'
    setBlogview(updview)
  }

  if ( blogview === 'hide') {
    if (isRemovable) {
      return (
        <div className="blog" style={blogStyle}>
          <span>{blog.title}</span>{blog.author}<button onClick={toggleView}>{blogview}</button><br />
          {blog.url} <br />
          likes {likes} <button onClick={handleLikes}>like</button> <br />
          {blog.user.name} <br />
          <button onClick={handleDelete}>remove</button>
        </div>
      )
    } else {
      return (
        <div className="blog" style={blogStyle}>
          <span>{blog.title}</span> {blog.author}<button onClick={toggleView}>{blogview}</button><br />
          {blog.url} <br />
          likes {likes} <button onClick={handleLikes}>like</button> <br />
          {blog.user.name} <br />
        </div>
      )
    }
  } else return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}<button onClick={toggleView}>{blogview}</button><br />
    </div>
  )
}

Blog.prototype = {
  blog: PropTypes.object.isRequired,
  handleLikes: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default Blog