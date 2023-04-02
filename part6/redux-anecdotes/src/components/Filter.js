import { useDispatch } from "react-redux"
import { useState } from "react"
import { setInputText } from "../reducers/filterReducer"

const Filter = () => {
    const [value, setValue] = useState('')
    
    const dispatch = useDispatch()
    
    const handleChange = (event) => {
      const inputText = event.target.value
      setValue(inputText)
      dispatch(setInputText(inputText))
    }

    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter <input onChange={handleChange} vaule={value} />
      </div>
    )
  }
  
  export default Filter