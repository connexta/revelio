import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { RetryLink } from 'apollo-link-retry'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import schema from './schema'

const { resolvers, typeDefs, context } = schema

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const btoa = arg => {
  if (typeof window !== 'undefined') {
    return window.btoa(arg)
  }
  return Buffer.from(arg).toString('base64')
}

const authorization = `Basic ${btoa('admin:admin')}`

const serverErrorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      return forward(operation, graphQLErrors)
    }
    if (networkError) {
      return forward(operation, networkError)
    }
    return forward(operation, {})
  }
)

const createServerApollo = (...args) => {
  // TODO: remove this block when we get auth working
  const { req } = args[0]
  if (!req.headers.authorization) {
    req.headers.authorization = authorization
  }

  const cache = new InMemoryCache()
  return new ApolloClient({
    link: ApolloLink.from([
      serverErrorLink,
      new SchemaLink({
        schema: executableSchema,
        context: context(...args),
      }),
    ]),
    ssrMode: true,
    cache,
  })
}

let logInModal
const clientErrorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.extensions.code === 'UNAUTHENTICATED') {
	    logInModal(true)
          //open modal and get credientials
          const oldHeaders = operation.getContext().headers
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: `Basic ${btoa('admin:admin')}`,
            },
          })
        }
      }
	
      //retry request with new credentials
      return forward(operation, graphQLErrors)
    }
    if (networkError) {
      //retry if network error
      return forward(networkError, operation)
    }
  }
)

const createClientApollo = (params) => {
    logInModal = params.onAuthentication
  const cache = new InMemoryCache()
  cache.restore(window.__APOLLO_STATE__)
  return new ApolloClient({
    link: ApolloLink.from([
      clientErrorLink,
      new BatchHttpLink({
        uri: '/graphql',
        credentials: 'same-origin',
        headers: { authorization },
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
