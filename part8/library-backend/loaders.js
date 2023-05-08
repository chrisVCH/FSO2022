const Book = require('./models/book')

const batchBooks = async (keys) => {
  const books = await Book.find({
    author: {
      $in: keys
    }
  })

  return keys.map(key => books.filter(book => JSON.stringify(book.author._id) === JSON.stringify(key)))
}

module.exports = batchBooks