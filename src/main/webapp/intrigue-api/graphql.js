import { SchemaLink } from 'apollo-link-schema'
// import { makeExecutableSchema } from 'graphql-tools'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
// import schema from './schema'

// const { resolvers, typeDefs, context } = schema

// const executableSchema = makeExecutableSchema({
//   typeDefs,
//   resolvers,
// })

export const createServerApollo = ({ executableSchema, context }) => (
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
