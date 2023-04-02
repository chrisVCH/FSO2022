import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "CREATE":
      return action.payload
    case "VOTE":
      return action.payload
    case "ERROR":
      return action.payload
    case "HIDE":
      return null
    default:
      return state
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

let timeoutID = null

export const showNotification = (actionType, msg, sec, dispatch) => {
  
  dispatch({ type: actionType, payload: msg })
  if (!timeoutID) {
    clearTimeout(timeoutID)
  }
  
  timeoutID = setTimeout(() => 
    dispatch({ type: 'HIDE' })
    , sec*1000
  )
}

export default NotificationContext