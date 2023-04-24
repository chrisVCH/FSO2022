import { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import storageService from './services/storage'

import LoginForm from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useNotificationDispatch } from './NotificationContext'
import { useUserDispatch, useUserValue } from './UserContext'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getBlogs, addBlog, updateBlog, removeBlog } from './requests'

const App = () => {
  const blogFormRef = useRef()
  const dispatch = useNotificationDispatch()
  const usrDispatch = useUserDispatch()
  const userinfo = useUserValue()

  const QueryClient = useQueryClient()

  const newBlogMutation = useMutation(addBlog, {
    onSuccess: (newBlog) => {
      const blogs = QueryClient.getQueryData('blogs')
      QueryClient.setQueryData('blogs', blogs.concat(newBlog))
    }
  })

  const updateBlogMutation = useMutation(updateBlog, {
    onSuccess: (updatedBlog) => {
      QueryClient.setQueryData('blogs', blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b ))
    }
  })

  const removeBlogMutation = useMutation(removeBlog, {
    onSuccess: () => {
      QueryClient.invalidateQueries('blogs')
    }
  })

  useEffect(() => {
    const user = storageService.loadUser()
    //setUser(user)
    usrDispatch({ type: 'LOGIN', payload: user })
  }, [])

  const notifyWith = (message, type) => {
    dispatch({ type: 'SHOW', payload: { type, message } })

    setTimeout(() => {
      dispatch({ type: 'HIDE' })
    }, 3000)
  }

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      //setUser(user)
      usrDispatch({ type: 'LOGIN', payload: user })
      storageService.saveUser(user)
      notifyWith('welcome!', 'info')
    } catch(e) {
      notifyWith('wrong username or password', 'error')
    }
  }

  const logout = async () => {
    usrDispatch({ type: 'LOGOUT' })
    storageService.removeUser()
    notifyWith('logged out', 'info')
  }

  const result = useQuery('blogs', getBlogs, {
    refetchOnWindowFocus: false
  })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  const blogs = result.data

  const createBlog = async (newBlog) => {
    newBlogMutation.mutate(newBlog)
    notifyWith(`A new blog '${newBlog.title}' by '${newBlog.author}' added`, 'info')
    blogFormRef.current.toggleVisibility()
  }

  const like = async (blog) => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    updateBlogMutation.mutate(blogToUpdate)
    notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`, 'info')
  }

  const remove = async (blog) => {
    const ok = window.confirm(`Sure you want to remove '${blog.title}' by ${blog.author}`)
    if (ok) {
      removeBlogMutation.mutate(blog.id)
      notifyWith(`The blog' ${blog.title}' by '${blog.author} removed`, 'info')
    }

  }

  const noUser = !userinfo ? true : userinfo.name === ''

  if (noUser) {
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
        {userinfo.name} logged in
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
            canRemove={userinfo && blog.user.username===userinfo.username}
            remove={() => remove(blog)}
          />
        )}
      </div>
    </div>
  )
}

export default App