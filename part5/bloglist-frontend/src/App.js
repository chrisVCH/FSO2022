import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      const dataBlogs = await blogService.getAll()
      const newdataBlogs = dataBlogs.map(b => b.likes ? b : { ...b, likes: 0 })
      newdataBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(newdataBlogs)
    }
    fetchBlogs()
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('error credential')
      const updMessage = {
        type: 'error',
        msg: 'wrong username or password'
      }
      setMessage(updMessage)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    const newBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(newBlog))
  }

  const handleLikes = async (id, blog) => {
    const updObject = {
      user: blog.user.id,
      likes: !blog.likes ? 1 : blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const updBlog = await blogService.increaseLikes(id, updObject)
    const updatedBlog = blogs.map(b => b.id === id ? { ...b, likes: updBlog.likes } : b)
    updatedBlog.sort((a, b) => b.likes - a.likes)

    setBlogs(updatedBlog)
  }

  const handleDelete = async (id, blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(id)
      const updBlogs = blogs.filter(b => b.id !== id)
      setBlogs(updBlogs)
      blogFormRef.current.toggleVisibility()
    }
  }

  const loginHeader = () => (
    <h2>log in to application</h2>
  )

  const blogsHeader = () => (
    <h2>blogs</h2>
  )

  return (
    <div>
      {user === null && loginHeader()}
      {user !== null && blogsHeader()}
      <Notification message={message} />
      <div>
        {user === null &&
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
        }
        {user &&
           <div>
             <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
             <Togglable buttonLabel='create a new blog' ref={blogFormRef}>
               <BlogForm createBlog={addBlog}  />
             </Togglable>
             {blogs.map(blog =>
               <Blog key={blog.id} blog={blog} handleLikes={() => handleLikes(blog.id, blog)} handleDelete={() => handleDelete(blog.id, blog)}  />
             )}
           </div>
        }
      </div>
    </div>
  )
}
export default App