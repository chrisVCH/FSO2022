import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notifiication'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import './index.css'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [operationMessage, setOperationMessage] = useState(null)
  
  const filteredpersons = newFilter === '' ? [...persons] : [...persons].filter( p => p.name.toUpperCase().includes(newFilter.toUpperCase()))

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const result = persons.find(({name}) => name.trim() === (`${newName}`).trim())

    if (result !== undefined) {
      if (window.confirm((`${newName}`).trim()  + ' is already added to the phonebook, replace the old number with a new one?')) {

        const updperson = persons.find(p => p.name.trim() === (`${newName}`).trim())
      
        personService
          .update(updperson.id, {...updperson, number: `${newNumber}`})
          .then(response => {
            const msg = {type: 'info', content:  `A number for ${newName} has been updated`}
            setOperationMessage(msg)
            setTimeout(() => {
              setOperationMessage(null)
            }, 5000)
            setPersons(persons.map (p => p.id !== updperson.id ?  p : {...p, number: `${newNumber}`}))
           })
       
        setNewName('')
        setNewNumber('')
      }
    } else {
      const temperson = { 
        name: `${newName}`, 
        number: `${newNumber}`
      }

      personService
        .create(temperson)
        .then(returnedPerson => {
          const msg = {type: 'info', content:  `Added ${newName}`}
          setOperationMessage(msg)
          setTimeout(() => {
            setOperationMessage(null)
          }, 5000)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleNameChange = (event) => {
      setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleInputFilter = (event) => {
    setNewFilter(event.target.value)
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
        
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .deletePerson(id)
        .then(deletedPerson => {setPersons(persons.filter(item => item.id !== id))})
        .catch(error => {
          const msg = {type: 'error', content:  `Person ${person.name} was already removed from server`}
          setOperationMessage(msg)
          setTimeout(() => {
            setOperationMessage(null)
          }, 5000)
          setPersons(persons.filter(item => item.id !== id))
        })
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={operationMessage} />
      <Filter newFilter={newFilter} handleInputFilter={handleInputFilter} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} addName={addName} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons filteredpersons={filteredpersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App