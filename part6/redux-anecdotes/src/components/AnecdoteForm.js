import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteForm = (props) => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    const displayMessage = `you created '${content}'`
    const secondsToDisplay = 5
    dispatch(setNotification(displayMessage, secondsToDisplay))
  }

  return (
    <>
    <h2>create new</h2>
    <form onSubmit={addAnecdote}>
      <div><input name="anecdote" /></div>
      <button type="sumbit">create</button>
    </form>
    </>
  )
}

export default AnecdoteForm
