import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { updateVote } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <>
    <div key={anecdote.id}>
    <div>
      {anecdote.content}
    </div>
    <div>
       has {anecdote.votes}
       <button onClick={handleClick}>vote</button>
    </div>
    </div>    
    </>
  )
}

const AnecdoteList = ()=> {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if ( filter.text === '' ) {
      return anecdotes
    }
    return anecdotes.filter(a => a.content.toLowerCase().includes(filter.text.toLowerCase()))
  })
  
  return (
    <div>
    {anecdotes.map(anecdote =>
      <Anecdote
        key={anecdote.id}
        anecdote={anecdote}
        handleClick={() => {
          const displayMessage = `you voted '${anecdote.content}'`
          const secondsToDisplay = 5
          dispatch(updateVote(anecdote.id))
          dispatch(setNotification(displayMessage, secondsToDisplay))
        }}
       />
    )}
    </div>   
  )
}

export default AnecdoteList