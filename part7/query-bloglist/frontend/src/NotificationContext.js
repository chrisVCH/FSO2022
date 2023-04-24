import { createContext, useContext, useReducer } from 'react'

const initialState = { type: '', message: null }
const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'SHOW':
    return action.payload
  case 'HIDE':
    return initialState
  default:
    return initialState
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}


export default NotificationContext