import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useNotificationDispatch } from '../NotificationContext'
import { useUserValue, useUserDispatch } from '../UserContext'
import { updateBlog, addBlogComment } from '../requests'
import storageService from '../services/storage'
import Notification from './Notification'

const Blog = ({ blog, blogs }) => {
  const navigate = useNavigate()
  const userinfo = useUserValue()
  const commentRef = useRef(null)
  const QueryClient = useQueryClient()
  const usrDispatch = useUserDispatch()
  const dispatch = useNotificationDispatch()

  const updateBlogMutation = useMutation(updateBlog, {
    onSuccess: (updatedBlog) => {
      QueryClient.setQueryData('blogs', blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b ))
    }
  })

  const addCommentMutation = useMutation(addBlogComment, {
    onSuccess: (updatedBlog) => {
      QueryClient.setQueryData('blogs', blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b ))
    }
  })

  const logout = async () => {
    usrDispatch({ type: 'LOGOUT' })
    storageService.removeUser()
    notifyWith('logged out', 'info')
    navigate('/')
  }

  const notifyWith = (message, type) => {
    dispatch({ type: 'SHOW', payload: { type, message } })

    setTimeout(() => {
      dispatch({ type: 'HIDE' })
    }, 3000)
  }

  const like = async () => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1 }
    updateBlogMutation.mutate(blogToUpdate)
    notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`, 'info')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const userinput = { comment: commentRef.current.value }

    const blogToUpdate = { ...blog, comments: blog.comments.concat(userinput) }
    addCommentMutation.mutate(blogToUpdate)
    event.target.reset()
  }

  if (!blog) {
    return null
  }
  return (
    <div>
      <h2>blogs</h2>
      <em>{userinfo.name} logged in</em>
      <br /><br />
      <button onClick={logout}>logout</button>
      <br />
      <Notification />
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <br />{blog.likes} likes <button onClick={like}>like</button>
      <br />added by {blog.user.name}
      <br /><br />
      <b>comments</b>
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <input
          ref={commentRef}
          id="user_comment"
          name="user_comment"
          type="text"
          placeholder="havent read this yet..."
        />
        <button type="submit">add comment</button>
      </form>
      <div>
        {<ul>{blog.comments.map((c) => <li key={c}>{c}</li>)}</ul>}
      </div>
    </div>
  )
}

export default Blog