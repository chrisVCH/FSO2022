import { createSlice } from '@reduxjs/toolkit'

const initialState = { type: '', message: null }
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setInfo: (state, action) => {
      state = action.payload
    }
  }
})

export const { setInfo } = notificationSlice.actions

export default notificationSlice.reducer