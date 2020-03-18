import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { toIdValue } from 'apollo-utilities'

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

const createApolloClient = params => {
  const { onAuthentication } = params
  const cache = new InMemoryCache({
    cacheRedirects: {
      Query: {
        metacardById: (_, args, { getCacheKey }) =>
          getCacheKey({ __typename: 'MetacardAttributes', id: args.id }),
      },
    },
  })
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
export default createApolloClient
