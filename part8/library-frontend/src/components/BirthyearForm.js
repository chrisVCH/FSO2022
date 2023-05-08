import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { SET_BIRTHYEAR, ALL_BOOKS, ALL_AUTHORS } from '../queries'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'

const BirthyearForm = ({ authors, setError }) => {

  const [birthyear, setBirthyear] = useState('')
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate()

  const [ setBornYear, result ] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_BOOKS}, { query: ALL_AUTHORS }],
    onError: (error) => {
      console.log('errors from setBornYear....', error.graphQLErrors[0])
      const errors = error.graphQLErrors[0].extensions.error.errors
      const messages = Object.values(errors).map(e => e.message).join('\n')
      setError(messages)
    }
  })

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError(`author not found`)
    }  // eslint-disable-next-line
  }, [result.data]) 

  const options = authors.map(a => ({ value: a.name, label: a.name }))

  const submit = (event) => {
    event.preventDefault()
      
    setBornYear({ 
      variables: { 
        name: selectedOption.value, setBornTo: parseInt(birthyear) 
      }
    })
            
    setSelectedOption(null)
    setBirthyear('')
    navigate('/')
  }

  return (
    <div>
      <br />
        <b>Set birthyear</b>
      <br /><br />
      <form onSubmit={submit}>
        <div>
          <Select 
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
          />
        </div>
        <div>
          born <input
            type="number"
            name="born"
            value={birthyear}
            onChange={({target}) => setBirthyear(target.value)}
          />   
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BirthyearForm