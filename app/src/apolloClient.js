import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'isomorphic-unfetch'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import cookies from './cookies'
import promiseToObservable from './utils/promise-to-observable'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const clientErrorLink = ssrMode => {
  const pollForAuth = async () => {
    while (!cookies.get('RSESSION')) {
      await sleep(100)
    }
    return true
  }
  return onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.extensions.code === 'UNAUTHENTICATED') {
          if (ssrMode) return
          cookies.remove('RSESSION')
          return promiseToObservable(pollForAuth()).flatMap(() => {
            return forward(operation)
          })
        }
      }
    }
  })
}
export default function createApolloClient(initialState, ctx) {
  const config = require('./configuration.js')
  const GRAPHQL_BASE_URL = config('GRAPHQL_BASE_URL')
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  const ssrMode = Boolean(ctx)
  const cache = new InMemoryCache({
    cacheRedirects: {
      Query: {
        metacardById: (_, args, { getCacheKey }) =>
          getCacheKey({ __typename: 'MetacardAttributes', id: args.id }),
      },
    },
  })
  cache.restore(initialState)
  const httpLink = new BatchHttpLink({
    uri: GRAPHQL_BASE_URL, // Server URL (must be absolute)
    credentials: 'include', // Additional fetch() options like `credentials` or `headers`
    fetch,
    //Need to manually set cookie if on server
    headers:
      (Boolean(ctx) && {
        Cookie: ctx.req.headers.cookie,
      }) ||
      undefined,
  })
  return new ApolloClient({
    ssrMode,
    link: ApolloLink.from([clientErrorLink(ssrMode), httpLink]),
    cache: cache,
  })
}
