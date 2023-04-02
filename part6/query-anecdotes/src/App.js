import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, createAnecdote, addVote } from './requests'
import { useNotificationDispatch, showNotification } from './NotificationContext'

const App = () => {

  const dispatch = useNotificationDispatch()

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    }
  })

  const updateAnecdoteMutation = useMutation(addVote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    }
  })

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
          
    newAnecdoteMutation.mutate(
      { content, votes: 0 },
      {
        onError: () => {
          const displayMessage = 'too short anecdote, must have length 5 or more'
          showNotification('ERROR', displayMessage, 5, dispatch)
        },
        onSuccess: () => {
          const displayMessage = `anecdote '${content}' created`
          showNotification('CREATE', displayMessage, 5, dispatch)
        },
      }
    )
  }
  
  const handleVote = (anecdote) => {
    const updAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    updateAnecdoteMutation.mutate(updAnecdote)
    const displayMessage = `anecdote '${anecdote.content}' voted`
    showNotification('VOTE', displayMessage, 5, dispatch)
  }

  const result = useQuery(
    'anecdotes',
    getAnecdotes,
    {
      retry: 1
    }
  )
  
  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <span>Error: {result.error.message}</span>
  }
  
  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm addAnecdote={addAnecdote} />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
