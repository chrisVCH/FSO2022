import { useState } from 'react'
//import { Button, Form } from 'react-bootstrap'
import { TextField, Button } from '@mui/material'
const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    await login(username, password)
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField label="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <TextField label="password" type='password' value={password} onChange={(e) => setPassword(e.target.value)} autoComplete='on' />
        </div>
        <div>
          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm