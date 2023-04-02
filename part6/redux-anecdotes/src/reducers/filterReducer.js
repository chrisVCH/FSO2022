import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  text: ''
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setInputText(state, action) {
      state.text = action.payload
    }
  }
})

export const { setInputText } = filterSlice.actions
export default filterSlice.reducer