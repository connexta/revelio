import { mergeDeep } from 'immutable'

const ensureArray = (value: any | any[]): any[] => {
  if (value === undefined) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  return [value]
}

const ensureObject = (value: any, args: any) => {
  if (typeof value === 'function') {
    return value(...args)
  }
  return value
}
type ResolverDefinition = {
  typeDefs: any[]
  resolvers?: any
  context?: any
}
export default (a: ResolverDefinition, b: ResolverDefinition) => {
  const resolvers = mergeDeep(a.resolvers, b.resolvers)
  const typeDefs = mergeDeep(ensureArray(a.typeDefs), ensureArray(b.typeDefs))

  const context = (...args: any[]) => {
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
