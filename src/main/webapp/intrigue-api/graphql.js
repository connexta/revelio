import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
const { BatchHttpLink } = require('apollo-link-batch-http')
import schema from './schema'

const { resolvers, typeDefs, context } = schema

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  context,
})

const btoa = arg => {
  if (typeof window !== 'undefined') {
    return window.btoa(arg)
  }
  return Buffer.from(arg).toString('base64')
}

const createServerApollo = () => {
  const cache = new InMemoryCache()
  return new ApolloClient({
    link: new SchemaLink({ schema: executableSchema }),
    ssrMode: true,
    cache,
  })
}

const createClientApollo = () => {
  const cache = new InMemoryCache()
  const auth = btoa('admin:admin')
  cache.restore(window.__APOLLO_STATE__)
  return new ApolloClient({
    link: new BatchHttpLink({
      uri: '/graphql',
      credentials: 'same-origin',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }),
    cache,
  })
}

module.exports = {
  createClientApollo,
  createServerApollo,
  resolvers,
  typeDefs,
  context,
}
