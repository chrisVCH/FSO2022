import axios from 'axios'

const baseUrl = 'http://localhost:3003/api/blogs'
const userUrl = 'http://localhost:3003/api/users'


import storageService from './services/storage'

const headers = {
  'Authorization': storageService.loadUser() ? `Bearer ${storageService.loadUser().token}` : null
}

export const getBlogs = () =>
  axios.get(baseUrl).then(res => res.data)

export const addBlog = (newBlog) =>
  axios.post(baseUrl, newBlog, { headers }).then(res => res.data)

export const updateBlog = (updBlog) =>
  axios.put(`${baseUrl}/${updBlog.id}`, updBlog, { headers }).then(res => res.data)

export const removeBlog = (id) =>
  axios.delete(`${baseUrl}/${id}`, { headers }).then(res => res.data)

export const getUser = (id) =>
  axios.get(`${userUrl}/${id}`).then(res => res.data)

export const addBlogComment = (updBlog) =>
  axios.post(`${baseUrl}/${updBlog.id}/comments`, updBlog.comments.slice(-1)[0]).then(res => res.data)
