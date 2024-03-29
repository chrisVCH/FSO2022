const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const resolvers = {
    Query: {
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: async () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        if (!args.author && !args.genre) {
          return await Book.find({}).populate('author')
        }
        if (args.author && args.genre) {
          const authorFound = await Author.findOne({ name: args.author })
          return await Book.find({ author: authorFound._id, genres: { $in: [args.genre] } }).populate('author') 
        }
        if (args.author) {
          const authorFound = await Author.findOne({ name: args.author })
          return await Book.find({ author: authorFound._id }).populate('author') 
        }
        if (args.genre) {
          //const books = await Book.find({ generes: args.genre })
          return await Book.find({ genres: { $in: [args.genre] } }).populate('author')  
        }
      }, 
      allAuthors: async () => await Author.find({}),
      me: (root, args, context) => {
        return context.currentUser
      },
    },
    Author: {
      bookCount: async (root, args, { loaders }) => {
        const foundBooks = await loaders.books.load(root._id)
        return foundBooks.length
      } 
    },
    Mutation: {
      addBook: async (root, args, context) => {
        
        const currentUser = context.currentUser
  
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions:{
              code: 'BAD_USER_INPUT'
            }
          })
        }
  
        let author = await Author.findOne({ name: args.author })
        if (!author) {
          const newauthor = new Author({ name: args.author, born: null })
          try {
            author = await newauthor.save()
          } catch (error) {
            throw new GraphQLError('Saving author failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.name,
                error
              }
            })
          }
        }
        const newbook = new Book({ ...args, author: author.id })
  
        try {
          var book = await newbook.save()
          book = book.populate('author')
        } catch (error) {
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return book
      },
      editAuthor: async (root, args, context) => {
        const currentUser = context.currentUser
        
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions:{
              code: 'BAD_USER_INPUT'
            }
          })
        }
  
        const authorFound = await Author.findOne({ name: args.name })
        if (!authorFound) {
          return null
        }
  
        const updatedAuthor = await Author.findOneAndUpdate({ name: args.name }, { $set: { born: args.setBornTo }})
        return updatedAuthor
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
  
        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.name,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
        
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQLError('wrong credentials', {
            extensions: { code: 'BAD_USER_INPUT'}
          })
        }
  
        const userForToken = {
          username: user.username,
          id: user._id,
        }
  
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET), favoriteGenre: user.favoriteGenre }
      }
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
      },
    },
  }

  module.exports = resolvers