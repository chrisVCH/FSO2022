import { useUserValue, useUserDispatch } from '../UserContext'
import { useNavigate, Link } from 'react-router-dom'
import storageService from '../services/storage'
import { useNotificationDispatch } from '../NotificationContext'
import Notification from './Notification'
//import { Table } from 'react-bootstrap'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper
} from '@mui/material'

const Users = ({ userBlogs }) => {
  const navigate = useNavigate()
  const userinfo = useUserValue()
  const usrDispatch = useUserDispatch()
  const dispatch = useNotificationDispatch()

  const notifyWith = (message, type) => {
    dispatch({ type: 'SHOW', payload: { type, message } })

    setTimeout(() => {
      dispatch({ type: 'HIDE' })
    }, 3000)
  }

  const logout = async () => {
    usrDispatch({ type: 'LOGOUT' })
    notifyWith('logged out', 'info')
    storageService.removeUser()
    navigate('/')
  }

  if (userinfo.name === '') {
    return null
  }

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      {userinfo.name} logged in
      <br /><br />
      <button onClick={logout}>logout</button>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead >
            <TableRow>
              <TableCell></TableCell>
              <TableCell><b>blogs created</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userBlogs.map(u => {
              const id = u.username.split(',')[0]
              const name = u.username.split(',')[1]
              return (
                <TableRow key={id}>
                  <TableCell><Link to={`/users/${id}`}>{name}</Link></TableCell>
                  <TableCell>{u.blogs}</TableCell>
                </TableRow>
              )})}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users