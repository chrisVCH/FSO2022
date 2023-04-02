import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { addVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    anecdotes.sort((a, b) => b.votes - a.votes)
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const updateVote = id => {
  return async (dispatch, getState) => {
    const state = getState().anecdotes

    const anecdoteToChange = state.find(a => a.id === id)
    const changedAnecdote = { ...anecdoteToChange, votes: anecdoteToChange.votes + 1 }
    await anecdoteService.updateVote(id, changedAnecdote)
    const updatedAnecdotes = state.map(anecdote =>
      anecdote.id !== id ? anecdote : changedAnecdote
      )
    updatedAnecdotes.sort((a, b) => b.votes - a.votes)
    dispatch(setAnecdotes(updatedAnecdotes))
  }
}


export default anecdoteSlice.reducer