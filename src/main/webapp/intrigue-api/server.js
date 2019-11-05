const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

const { genSchema } = require('./gen-schema')

const typeDefs = gql(genSchema())

const { resolvers } = require('./graphql')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatResponse: response => {
    console.log(response)
    return response
  },
})

const app = express()
server.applyMiddleware({ app })
app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
)
