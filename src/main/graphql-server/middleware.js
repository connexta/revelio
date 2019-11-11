const { genSchema } = require('../webapp/intrigue-api/gen-schema')
const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
const typeDefs = gql(genSchema())
const renderer = require('./helpers/renderer')

const { resolvers } = require('../webapp/intrigue-api/graphql')

const app = express.Router()
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

app.use(renderer)
server.applyMiddleware({ app })
app.use(express.static('public'))

export default app
