  const Persons = ({filteredpersons, handleDelete})=> {
    return (
      filteredpersons.map(n => <div key={n.id}>{n.name} {n.number} <button onClick={ () => handleDelete(n.id) }>delete</button></div>)
    )
  }

  export default Persons