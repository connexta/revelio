const { genSchema } = require('../webapp/intrigue-api/gen-schema')
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const typeDefs = genSchema()
const renderer = require('./helpers/renderer')
import createRpcClient from '../webapp/intrigue-api/rpc'
const fetch = require('../webapp/intrigue-api/fetch')
const { resolvers } = require('../webapp/intrigue-api/graphql')

const app = express.Router()
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { authorization = '' } = req.headers
    const universalFetch = (url, opts = {}) => {
      return fetch(url, {
        ...opts,
        headers: {
          ...opts.headers,
          authorization,
        },
      })
    }
    const request = createRpcClient(universalFetch)

    const methods = {
      create: 'ddf.catalog/create',
      query: 'ddf.catalog/query',
      update: 'ddf.catalog/update',
      delete: 'ddf.catalog/delete',
      getSourceIds: 'ddf.catalog/getSourceIds',
      getSourceInfo: 'ddf.catalog/getSourceInfo',
    }

    const catalog = Object.keys(methods).reduce((catalog, method) => {
      catalog[method] = params => request(methods[method], params)
      return catalog
    }, {})
    return { catalog, fetch: universalFetch }
  },
})

app.use(renderer)
server.applyMiddleware({ app })

export default app
