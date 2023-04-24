import { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import storageService from './services/storage'

import LoginForm from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import { useDispatch, useSelector } from 'react-redux'
import { setInfo } from './reducers/notificationReducers'
import { initializeBlogs, setBlogs } from './reducers/blogReducers'
import { setUser } from './reducers/userReducers'

const App = () => {
  //const [blogs, setBlogs] = useState([])
  //const [user, setUser] = useState('')
  //const [info, setInfo] = useState({ message: null })

  const dispatch = useDispatch()

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const blogFormRef = useRef()

  useEffect(() => {
    const user = storageService.loadUser()
    dispatch(setUser(user))
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())}, [dispatch])

  const notifyWith = (message, type='info') => {
    dispatch(setInfo({
      message, type
    }))

    setTimeout(() => {
      dispatch(setInfo({ message: null }))
    }, 3000)
  }

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      dispatch(setUser(user))
      storageService.saveUser(user)
      notifyWith('welcome!')
    } catch(e) {
      notifyWith('wrong username or password', 'error')
    }
  }

  const logout = async () => {
    dispatch(setUser(null))
    storageService.removeUser()
    notifyWith('logged out')
  }

  const createBlog = async (newBlog) => {
    const createdBlog = await blogService.create(newBlog)
    notifyWith(`A new blog '${newBlog.title}' by '${newBlog.author}' added`)
    dispatch(setBlogs(blogs.concat(createdBlog)))
    blogFormRef.current.toggleVisibility()
  }

  const like = async (blog) => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    const updatedBlog = await blogService.update(blogToUpdate)
    notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`)
    dispatch(setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b)))
  }

  const remove = async (blog) => {
    const ok = window.confirm(`Sure you want to remove '${blog.title}' by ${blog.author}`)
    if (ok) {
      await blogService.remove(blog.id)
      notifyWith(`The blog' ${blog.title}' by '${blog.author} removed`)
      dispatch(setBlogs(blogs.filter(b => b.id !== blog.id)))
    }

  }

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm login={login} />
      </div>
    )
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>
      <Togglable buttonLabel='new note' ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>
      <div>
        {[...blogs].sort(byLikes).map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            like={() => like(blog)}
            canRemove={user && blog.user.username===user.username}
            remove={() => remove(blog)}
          />
        )}
      </div>
    </div>
  )
}

export default App