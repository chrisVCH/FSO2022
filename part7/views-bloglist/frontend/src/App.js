import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useUserDispatch, useUserValue } from './UserContext'
import { getBlogs } from './requests'
import { Routes, Route, Navigate, useMatch } from 'react-router-dom'
import storageService from './services/storage'
import Login from './components/Login'
import User from './components/User'
import Blog from './components/Blog'
import Users from './components/Users'
import { userWithBlogs } from './utils/bloglist_helper'
import { Container } from '@mui/material'

const App = () => {

  const usrDispatch = useUserDispatch()
  const userinfo = useUserValue()
  const match = useMatch('/blogs/:id')

  useEffect(() => {
    const user = storageService.loadUser()
    usrDispatch({ type: 'LOGIN', payload: user })
  }, [])

  const result = useQuery('blogs', getBlogs, {
    refetchOnWindowFocus: false
  })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  const blogs = result.data

  const blog = match
    ? blogs.find(blog => blog.id === (match.params.id))
    : null

  const userBlogs = userWithBlogs(blogs)
  const noUser = !userinfo ? true : userinfo.name === ''

  return (
    <Container>
      <div>
        <Routes>
          <Route path="/" element={<Login blogs={blogs} />} />
          <Route path="/users" element={ !noUser ? <Users userBlogs={userBlogs} /> : <Navigate replace to="/" /> } />
          <Route path="/users/:id" element={ !noUser ? <User blogs={blogs} /> : <Navigate replace to="/" /> } />
          <Route path="/blogs/:id" element={ !noUser ? <Blog blog={blog} blogs={blogs} /> : <Navigate replace to="/" /> } />
        </Routes>
      </div>
    </Container>
  )
}

export default App