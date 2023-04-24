import { useUserDispatch, useUserValue } from '../UserContext'
import storageService from '../services/storage'
import {
  useNavigate,
  useParams,
  Link
} from 'react-router-dom'

const User = ({ blogs }) => {
  const navigate = useNavigate()
  const id = useParams().id
  const userinfo = useUserValue()
  const usrDispatch = useUserDispatch()

  const user = blogs.filter(b => b.user.id === id)

  const logout = async () => {
    usrDispatch({ type: 'LOGOUT' })
    storageService.removeUser()
    //notifyWith('logged out', 'info')
    navigate('/')
  }

  if (userinfo.name === '') {
    return null
  }

  return (
    <div>
      <h2>blogs</h2>
      <em>{userinfo.name} logged in</em>
      <br /><br />
      <button onClick={logout}>logout</button>
      <h2>{user[0].user.name}</h2>
      <b>added blogs</b>
      <ul>
        {user.map(
          u => <li key={u.id}><Link to={`/blogs/${u.id}`}>{u.title}</Link></li>
        )}
      </ul>
    </div>
  )
}

export default User