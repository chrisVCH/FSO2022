import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setMessageInfo(state, action) {
      state.message = action.payload
    },
    clearMessageInfo(state, action) {
      state.message = null
    }
  }
})

export const { setMessageInfo, clearMessageInfo } = notificationSlice.actions
export default notificationSlice.reducer

export const setNotification = (msg, sec) => (
  dispatch
) => {
  dispatch(setMessageInfo(msg))
  setTimeout(() =>
    dispatch(clearMessageInfo()),
    1000*sec
  )
}