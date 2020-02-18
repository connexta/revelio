import { mergeDeep } from 'immutable'
import context from './context'

const ensureArray = value => {
  if (value === undefined) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  return [value]
}

const ensureObject = (value, args) => {
  if (typeof value === 'function') {
    return value(...args)
  }
  return value
}

const mergeModules = (a, b) => {
  const resolvers = mergeDeep(a.resolvers, b.resolvers)
  const typeDefs = mergeDeep(ensureArray(a.typeDefs), ensureArray(b.typeDefs))

  const context = (...args) => {
    return {
      ...ensureObject(a.context, args),
      ...ensureObject(b.context, args),
    }
  }

  return {
    resolvers,
    typeDefs,
    context,
  }
}

const typeDefs = `
  # Arbitrary Json
  scalar Json
  # Binary content embedded as a base64 String
  scalar Binary
  # WKT embedded as a String
  scalar Geometry
  # XML embedded as a String
  scalar XML
  # ISO 8601 Data Time embedded as a String
  scalar Date

  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`

export const base = {
  resolvers: {},
  typeDefs,
  context,
}

export default [
  base,
  require('./metacards/metacards')(),
  require('./location/location'),
  require('./user/user'),
  require('./sources/sources'),
  require('./metacard-types/metacard-types'),
  require('./system-properties/system-properties'),
  require('./login/login'),
].reduce(mergeModules)
