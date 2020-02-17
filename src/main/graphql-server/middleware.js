const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const renderer = require('./helpers/renderer').default
const { createLogger, format, transports } = require('winston')
const { v4 } = require('uuid')
const onFinished = require('on-finished')
const config = require('../configuration')

const {
  resolvers,
  typeDefs,
  context,
} = require('../webapp/intrigue-api/schema').default

const btoa = arg => {
  return Buffer.from(arg).toString('base64')
}

const Authorization = 'Basic ' + btoa('admin:admin')

const router = express.Router()

const LOG_LEVEL = config('LOG_LEVEL')
const rootLogger = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'revelio' },
  transports: [
    process.env.NODE_ENV === 'production'
      ? new transports.Console()
      : new transports.File({ filename: 'target/server.log' }),
  ],
})

router.use((req, res, next) => {
  const correlationId = v4()
  req.logger = rootLogger.child({ correlationId })
  res.header({ 'Revelio-Correlation-Id': correlationId })
  next()
})

router.use((req, res, next) => {
  const { url, method, connection } = req
  const { remoteAddress } = connection
  const profiler = req.logger.startTimer()

  onFinished(res, (err, res) => {
    const { statusCode: status, statusMessage: message } = res

    profiler.done({
      type: 'http-server-request',
      remoteAddress,
      url,
      method,
      message,
      status,
    })
  })

  next()
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    headers: {
      Authorization,
    },
  },
  context,
})

// Useful for getting example request/responses from the graphql endpoint.
// Off by default.
export const captureGraphql = () => {
  rootLogger.info({ message: 'GraphQL capturing enabled.' })
  const captures = []

  return (req, res, next) => {
    if (req.path === '/captures') {
      return res.json(captures)
    }

    if (req.method !== 'POST') {
      return next()
    }

    const request = req.body

    const defaultWrite = res.write
    const defaultEnd = res.end
    const chunks = []

    res.write = (...restArgs) => {
      chunks.push(new Buffer(restArgs[0]))
      defaultWrite.apply(res, restArgs)
    }

    res.end = (...restArgs) => {
      if (restArgs[0]) {
        chunks.push(new Buffer(restArgs[0]))
      }

      const response = JSON.parse(Buffer.concat(chunks).toString('utf8'))

      captures.push({ request, response })

      defaultEnd.apply(res, restArgs)
    }

    next()
  }
}

if (config('GRAPHQL_CAPTURE')) {
  router.use(express.json())
  router.use('/graphql', captureGraphql())
}

server.applyMiddleware({ app: router })

router.use('*', renderer)

module.exports = router
