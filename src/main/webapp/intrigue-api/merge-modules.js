import { mergeDeep } from 'immutable'

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

export default (a, b) => {
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
