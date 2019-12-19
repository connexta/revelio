const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const renderer = require('./helpers/renderer')

const {
  resolvers,
  typeDefs,
  context,
} = require('../webapp/intrigue-api/graphql')

const btoa = arg => {
  return Buffer.from(arg).toString('base64')
}

const Authorization = 'Basic ' + btoa('admin:admin')

const router = express.Router()
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
const captureGraphql = () => {
  // eslint-disable-next-line no-console
  console.log('GraphQL capturing enabled.')
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

if (process.env.GRAPHQL_CAPTURE) {
  router.use(express.json())
  router.use('/graphql', captureGraphql())
}

server.applyMiddleware({ app: router })

router.use('*', renderer)

module.exports = router
