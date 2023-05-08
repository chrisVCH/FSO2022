import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import BirthyearForm from './components/BirthyearForm'
import Recommendation from './components/Recommendation'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'
import Notify from './components/Notify'
import { SmallButton, Navigation } from './components/styled'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqByTitle = (a) => {   
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [favoriteGenre, setFavoriteGenre] = useState(null)
  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)
  const client = useApolloClient()
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })
    
  if (resultAuthors.loading) {
    return <div>loading...</div>
  }

  if (resultBooks.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()  
  }
  
  return (
    
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <br />
        <Navigation>
          <SmallButton as={Link} to="/">authors</SmallButton>
          <SmallButton as={Link} to="/books">books</SmallButton>
          { !token && <SmallButton as={Link} to="/login">login</SmallButton> }
          { token && <SmallButton as={Link} to="/newbook">add book</SmallButton> }
          { token && <SmallButton as={Link} to="/recommend">recommend</SmallButton> }
          { token && <SmallButton as={Link} to="/setbirthyear">set birthyear</SmallButton> }
          { token && <SmallButton as={Link} to="/" onClick={logout} >logout</SmallButton> }
        </Navigation>
      </div>

      <Routes>
        <Route path="/" element={<Authors authors={resultAuthors.data.allAuthors} setError={notify} />} />
        <Route path="/books" element={<Books books={resultBooks.data.allBooks} />} />
        <Route path="/login" element={!token ? <LoginForm setToken={setToken} setError={notify} setFavoriteGenre={setFavoriteGenre} /> : <Navigate replace to="/" />} />
        <Route path="/newbook" element={<NewBook setError={notify} />} />
        <Route path="/recommend" element={<Recommendation books={resultBooks.data.allBooks} favoriteGenre={favoriteGenre} />} />
        <Route path="/setbirthyear" element={<BirthyearForm authors={resultAuthors.data.allAuthors} setError={notify} />} />
      </Routes>
    </div>
    
  )
}

export default App
