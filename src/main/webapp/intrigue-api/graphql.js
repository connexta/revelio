import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import schema from './schema'

const { resolvers, typeDefs, context } = schema

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const createServerApollo = (...args) => {
  const cache = new InMemoryCache()
  return new ApolloClient({
    link: ApolloLink.from([
      new SchemaLink({
        schema: executableSchema,
        context: context(...args),
      }),
    ]),
    ssrMode: true,
    cache,
  })
}

const clientErrorLink = onAuthentication =>
  onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.extensions.code === 'UNAUTHENTICATED') {
          onAuthentication(() => {
            forward(operation, graphQLErrors)
          })
        }
      }
    }
    if (networkError) {
      return forward(networkError, operation)
    }
  })

const createClientApollo = params => {
  const { onAuthentication } = params
  const cache = new InMemoryCache()
  cache.restore(window.__APOLLO_STATE__)
  return new ApolloClient({
    link: ApolloLink.from([
      clientErrorLink(onAuthentication),
      new BatchHttpLink({
        uri: '/graphql',
        credentials: 'same-origin',
      }),
    ]),
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
