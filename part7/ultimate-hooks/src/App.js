import { useState, useEffect } from 'react'
import axios from 'axios'


const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  
  useEffect(() => {
    getAll()
  // eslint-disable-next-line
  }, [])

  let token = null
  const setToken = newToken => {
    token = `bearer ${newToken}`
  }

  const create = async (resource) => {
    const config ={
      headers: { Authorization: token},
    }
    try {
      const response = await axios.post(baseUrl, resource, config)
      setResources(resources.concat(response.data))
    } catch (error) {
      console.log('error from creat...', error)
    }
  }

  const getAll = async () => {
    try {
      const response = await axios.get(baseUrl)
      setResources(response.data)
    } catch (error) {
      console.log('error from getAll...', error)
    }
  }

  const update = async (id, resource) => {
    try {
      const response = await axios.put(`${ baseUrl }/${id}`, resource)
      setResources(response.data)
    } catch (error) {
      console.log('error from update...', error)
    }
  }

  const service = {
    create,
    getAll, 
    update,
    setToken
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App