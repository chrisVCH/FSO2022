import { useState } from 'react'
import { useMutation, useApolloClient } from '@apollo/client'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, ALL_BOOKS_GENRE } from '../queries'
import { updateCache } from '../App'

const NewBook = ({ setError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const client = useApolloClient()

  const [ createBook ] = useMutation(ADD_BOOK, {
    //refetchQueries: { query: ALL_BOOKS_GENRE },
    onError: (error) => {
      console.log('errors from createBook....', error.graphQLErrors[0])
      const errors = error.graphQLErrors[0].extensions.error.errors
      const messages = Object.values(errors).map(e => e.message).join('\n')
      setError(messages)
    },
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook)

      const existingAuthors = cache.readQuery({
        query: ALL_AUTHORS
      })

      if (!existingAuthors.allAuthors.length) {
        return null
      }
      const authorFound = existingAuthors.allAuthors.find(a => a.name === response.data.addBook.author.name)
      if (authorFound) {
        return null
      }
      const newAuthor = {
        name: response.data.addBook.author.name,
        born: response.data.addBook.author.born,
        bookCount: 1
      }

      cache.writeQuery({
        query: ALL_AUTHORS,
        data: {
          allAuthors: [newAuthor, ...existingAuthors.allAuthors]
        }
      })

      const foundGenre = response.data.addBook.genres
 
      const genreQuery = { 
        query: ALL_BOOKS_GENRE,
        variables: {
          genre: foundGenre
        }
      }
      const existingGenreCache = client.readQuery(genreQuery)
         
      if (!existingGenreCache) {
        return null
      }
      
      cache.writeQuery({
        ...genreQuery,
        data: {
          allbooks: [response.data.addBook, ...existingGenreCache.allBooks]
        }
      })
    }
  })

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')
    const yearPublished = parseInt(published)
    createBook({ 
      variables: { 
        title, author, 
        published: yearPublished, genres 
      }
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook