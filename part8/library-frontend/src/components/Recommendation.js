const Recommendation = ({ books, favoriteGenre }) => {

  const filteredBooks = books.filter(b => b.genres.includes(favoriteGenre))
  
  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favourite genre <b>{favoriteGenre}</b>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
    </div>
  )
}

export default Recommendation
