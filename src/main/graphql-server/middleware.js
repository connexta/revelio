const { genSchema } = require('../webapp/intrigue-api/gen-schema')
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const typeDefs = genSchema()
const renderer = require('./helpers/renderer')

const { resolvers } = require('../webapp/intrigue-api/graphql')

const app = express.Router()
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

app.use(renderer)
server.applyMiddleware({ app })

export default app
