const PersonForm = ({newName, newNumber, addName, handleNameChange, handleNumberChange}) => {
    return (
      <form onSubmit={addName}>
        <div>
          name: <input id="nameinput" value={newName} onChange={handleNameChange}  />
        </div>
        <div>
          number: <input id="numberinput" value={newNumber} onChange={handleNumberChange}  />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
  }

  export default PersonForm