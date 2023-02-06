const Filter = ({newFilter, handleInputFilter})=> {
    //const filterinput = useAutoFocus()
    return (
      <div>
      filter shown with <input id="filterinput" value={newFilter} onChange={handleInputFilter} />
      </div>
  
    )
  }

export default Filter