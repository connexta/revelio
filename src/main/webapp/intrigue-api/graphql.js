import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { makeExecutableSchema } from 'graphql-tools'
import { createTransport } from './lib/transport'

import fetch from './fetch'
import typeDefs from 'raw-loader!./schema.graphql'

const cache = new InMemoryCache()

const getBuildInfo = () => {
  const commitHash = __COMMIT_HASH__
  const isDirty = __IS_DIRTY__
  const commitDate = __COMMIT_DATE__

  return {
    commitHash,
    isDirty,
    commitDate,
    identifier: `${commitHash.trim()}${isDirty ? ' with Changes' : ''}`,
    releaseDate: commitDate,
  }
}

const systemProperties = async () => {
  const [configProperties, configUiProperties] = await Promise.all([
    (await fetch('./internal/config')).json(),
    (await fetch('./internal/platform/config/ui')).json(),
  ])
  return {
    ...configProperties,
    ...configUiProperties,
    ...getBuildInfo(),
  }
}

const { send } = createTransport()

const toCamelCase = str => {
  return str
    .replace(/(\.|-)/g, ' ')
    .split(' ')
    .map((word, index) => {
      if (index == 0) {
        return word.toLowerCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
}

const toCamelCaseAttrs = map => {
  return Object.keys(map).reduce((attrs, attr) => {
    const name = toCamelCase(attr)
    attrs[name] = map[attr]
    return attrs
  }, {})
}

const metacards = async (ctx, args) => {
  const { src, ...query } = args.q

  const req = send({ src, ...query })
  const json = await req.json()

  const attributes = json.results.map(result =>
    toCamelCaseAttrs(result.metacard.properties)
  )

  return { attributes, ...json }
}

const metacardsByTag = async (ctx, args) => {
  return metacards(ctx, {
    q: {
      src: 'ddf.distribution',
      filterTree: {
        type: '=',
        property: 'metacard-tags',
        value: args.tag,
      },
    },
  })
}

const user = async () => {
  const res = await fetch('./internal/user')
  return res.json()
}

const sources = async () => {
  const res = await fetch('./internal/catalog/sources')
  return res.json()
}

const metacardTypes = async () => {
  const res = await fetch('./internal/metacardtype')
  const json = await res.json()

  const types = Object.keys(json).reduce((types, group) => {
    return Object.assign(types, json[group])
  }, {})

  return Object.keys(types).map(k => types[k])
}

const Query: QueryResolvers = {
  user,
  sources,
  metacards,
  metacardsByTag,
  metacardTypes,
  systemProperties,
}

const resolvers = {
  Query,
}

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export const createClient = () => {
  return new ApolloClient({
    link: new SchemaLink({ schema: executableSchema }),
    cache,
  })
}
