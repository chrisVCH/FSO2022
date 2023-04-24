import { configureStore } from '@reduxjs/toolkit'

import blogReducers from './reducers/blogReducers'
import notificationReducers from './reducers/notificationReducers'
import userReducers from './reducers/userReducers'

export const store = configureStore({
  reducer: {
    notifications: notificationReducers,
    blogs: blogReducers,
    user: userReducers
  }
})

