import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { ApolloLink } from 'apollo-link'
import authenticationLink from './apollo-links/authentication-link'

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
      authenticationLink(onAuthentication),
      new BatchHttpLink({
        uri: '/graphql',
        credentials: 'same-origin',
      }),
    ]),
    cache,
  })
}
export default createApolloClient
