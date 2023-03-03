const jwt = require('jsonwebtoken')
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization !== undefined && authorization.startsWith('Bearer ')) {
    //return authorization.replace('Bearer ', '')
    const bearer = authorization.split(' ')
    const bearerToken = bearer[1]
    request.token = bearerToken
    next()
  } else {
    request.token = null
    next()
  }
}

const userExtractor = (request, response, next) => {
  const bearerToken = request.token

  if (bearerToken !== null) {
    const decodedToken = jwt.verify(bearerToken, process.env.SECRET)
    if (decodedToken.id) {
      request.user = decodedToken.id
      next()
    } else {
      request.user = null
      next()
    }
  } else {
    request.user = null
    next()
  }
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}