import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS_GENRE } from '../queries'

const Books = ({ books }) => {

  const [displaygenre, setDisplaygenre] = useState(null)
    
  const result = useQuery(ALL_BOOKS_GENRE, {
    variables: { genre: displaygenre },
    skip: !displaygenre
  })

  const allgenres = books.reduce(
    (accumulator, currentValue) => [...accumulator, ...currentValue.genres],
    [],
  );

  const genresWithNoDuplicates = allgenres.reduce((accumulator, currentValue) => {
    if (!accumulator.includes(currentValue)) {
      return [...accumulator, currentValue];
    }
    return accumulator;
  }, []).sort();

  const handleClick = (filteredGenre) => {

    setDisplaygenre(filteredGenre)
  }
    
  const filteredBooks = displaygenre && result.data ? 
    result.data.allBooks
    : books

  const selectGenre = !displaygenre ? "all" : displaygenre
    
  return (
    <div>
      <h2>books</h2>
      <div>
        in genre <b>{selectGenre}</b>
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
      <div>
        {genresWithNoDuplicates.map(g => <button onClick={() => handleClick(g)} key={g}>{g}</button>)}   
      </div>
    </div>
  )
}

export default Books
