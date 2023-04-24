import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserValue, useUserDispatch } from '../UserContext'
import storageService from '../services/storage'
import { useNotificationDispatch } from '../NotificationContext'
import Notification from './Notification'
import LoginForm from './LoginForm'
import Togglable from './Togglable'
import NewBlog from './NewBlog'
import loginService from '../services/login'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { addBlog } from '../requests'
//import { Nav, Navbar, Button, Container } from 'react-bootstrap'
import { Alert, AppBar, Toolbar, IconButton, Button } from '@mui/material'

const Login = ({ blogs }) => {
  const usrDispatch = useUserDispatch()
  const navigate = useNavigate()
  const dispatch = useNotificationDispatch()
  const userinfo = useUserValue()
  const blogFormRef = useRef()
  const QueryClient = useQueryClient()
  const [message, setMessage] = useState(null)

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
    }, 5000)
  }

  const noUser = !userinfo ? true : userinfo.name === ''

  const newBlogMutation = useMutation(addBlog, {
    onSuccess: (newBlog) => {
      const blogs = QueryClient.getQueryData('blogs')
      QueryClient.setQueryData('blogs', blogs.concat(newBlog))
    }
  })
  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      usrDispatch({ type: 'LOGIN', payload: user })
      storageService.saveUser(user)
      notifyWith('welcome!', 'info')
      setMessage(`welcome ${user.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 10000)
    } catch(e) {
      notifyWith('wrong username or password', 'error')
    }
  }

  const createBlog = async (newBlog) => {
    newBlogMutation.mutate(newBlog)
    notifyWith(`A new blog '${newBlog.title}' by '${newBlog.author}' added`, 'info')
    blogFormRef.current.toggleVisibility()
  }

  if (noUser) {
    return (
      <div>
        <Notification />
        <LoginForm login={login} />
      </div>
    )
  }

  const blogstyle = {
    marginBottom: 2,
    padding: 5,
    borderStyle: 'solid'
  }
  return (
    <>
      <Notification />
      <div>
        {(message &&
          <Alert severity="success">
            {message}
          </Alert>
        )}
      </div>

      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
          </IconButton>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            users
          </Button>
          <Button color="inherit" onClick={logout}>
            logout
          </Button>
          {userinfo.name} logged in
        </Toolbar>
      </AppBar>

      <h2>blog app</h2>
      <Togglable buttonLabel='create new' ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>
      {blogs.map(b => <div key={b.id} style={blogstyle}><Link to={`/blogs/${b.id}`}>{b.title}</Link></div>)}
    </>
  )
}

export default Login