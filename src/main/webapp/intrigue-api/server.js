const { ApolloServer, gql } = require('apollo-server')

const { genSchema } = require('./gen-schema')

const typeDefs = gql(genSchema())

const { resolvers } = require('./graphql')

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`Apollo Server ready at ${url}`)
})
