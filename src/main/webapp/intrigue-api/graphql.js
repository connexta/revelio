import { SchemaLink } from 'apollo-link-schema'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'

const createServerApollo = ({ executableSchema, context }) => (
  ...args
) => {
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

module.exports = {
  createServerApollo,
}
