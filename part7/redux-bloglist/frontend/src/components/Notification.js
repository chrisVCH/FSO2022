import { useSelector } from 'react-redux'


const Notification = () => {

  const message = useSelector((state) => state.notifications.message)
  const type = useSelector((state) => state.notifications.type)

  if (!message) {
    return null
  }

  const style = {
    color: type==='error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification