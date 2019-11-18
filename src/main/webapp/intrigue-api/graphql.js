import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import { fromJS } from 'immutable'
import { mergeDeepOverwriteLists } from '../utils'
const fetch = require('./fetch')
const ROOT = '/search/catalog/internal'
const { genSchema, toGraphqlName, fromGraphqlName } = require('./gen-schema')
const { BatchHttpLink } = require('apollo-link-batch-http')

const removeProperty = propertyName => data =>
  data
    .filter((_, key) => key !== propertyName)
    .map(
      property =>
        typeof property !== 'object' || property === null
          ? property
          : removeProperty(propertyName)(property)
    )

const removeTypename = data => removeProperty('__typename')(fromJS(data)).toJS()

const getBuildInfo = () => {
  /* eslint-disable */
  const commitHash = process.env.__COMMIT_HASH__ || ''
  const isDirty = process.env.__IS_DIRTY__ || ''
  const commitDate = process.env.__COMMIT_DATE__ || ''
  /* eslint-enable */

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
    (await fetch(`${ROOT}/config`)).json(),
    (await fetch(`${ROOT}/platform/config/ui`)).json(),
  ])
  return {
    ...configProperties,
    ...configUiProperties,
    ...getBuildInfo(),
  }
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const { write } = require('./cql')

const getCql = ({ filterTree, cql }) => {
  if (filterTree !== undefined) {
    return '(' + write(filterTree) + ')'
  }
  return cql
}

const processQuery = ({ filterTree, cql, ...query }) => {
  const cqlString = getCql({ filterTree, cql })
  return JSON.stringify({ cql: cqlString, ...query })
}

const handleError = (code, data) => {
  let e = null

  try {
    const json = typeof data === 'string' ? JSON.parse(data) : data
    const message = json.message || 'Unknown error'
    const error = Error(`${code}: ${message}`)
    error.data = json
    e = error
  } catch (_) {
    e = Error(data)
  }

  e.code = code
  throw e
}

const send = async query => {
  const res = await fetch(`${ROOT}/cql`, {
    method: 'POST',
    body: processQuery(query),
  })

  if (!res.ok) {
    handleError(res.status, await res.text())
  }

  return res.json()
}

const renameKeys = (f, map) => {
  return Object.keys(map).reduce((attrs, attr) => {
    const name = f(attr)
    attrs[name] = map[attr]
    return attrs
  }, {})
}

const toGraphqlMap = map => {
  return Object.keys(map).reduce((attrs, attr) => {
    const name = toGraphqlName(attr)
    attrs[name] = map[attr]
    return attrs
  }, {})
}

const fromGraphqlMap = map => {
  return Object.keys(map).reduce((attrs, attr) => {
    const name = fromGraphqlName(attr)
    attrs[name] = map[attr]
    return attrs
  }, {})
}

const queries = ids => async parent => {
  const filters = ids.map(id => {
    return {
      type: '=',
      property: 'id',
      value: id,
    }
  })

  const filterTree = {
    type: 'AND',
    filters: [
      {
        type: 'OR',
        filters,
      },
      {
        type: 'LIKE',
        property: 'metacard-tags',
        value: '%',
      },
    ],
  }

  const res = await metacards(parent, { filterTree })

  return res.attributes.map(attrs => {
    const { filterTree } = attrs

    return {
      ...attrs,
      filterTree: () => JSON.parse(filterTree),
    }
  })
}

const metacards = async (ctx, args) => {
  const q = { ...args.settings, filterTree: args.filterTree }
  const json = await send(q)

  const attributes = json.results.map(result => {
    const properties = toGraphqlMap(result.metacard.properties)
    return {
      ...properties,
      queries: queries(properties.queries),
    }
  })

  return { attributes, ...json }
}

const queryTemplates = {
  accessAdministrators: 'security_access_administrators',
  accessGroups: 'security_access_groups',
  accessGroupsRead: 'security_access_groups_read',
  accessIndividuals: 'security_access_individuals',
  accessIndividualsRead: 'security_access_individuals_read',
  created: 'created',
  filterTemplate: 'filter_template',
  modified: 'modified',
  owner: 'metacard_owner',
  querySettings: 'query_settings',
  id: 'id',
  title: 'title',
}

const fetchQueryTemplates = async () => {
  const res = await fetch(`${ROOT}/forms/query`)
  const json = await res.json()
  const attributes = json
    .map(attrs => renameKeys(k => queryTemplates[k], attrs))
    .map(({ modified, created, ...rest }) => {
      return {
        ...rest,
        created: new Date(created).toISOString(),
        modified: new Date(modified).toISOString(),
      }
    })
  const status = {
    // count: Int
    // elapsed: Int
    // hits: Int
    // id: ID
    // successful: Boolean
    count: attributes.length,
    successful: true,
    hits: attributes.length,
  }
  return { attributes, status }
}

const metacardsByTag = async (ctx, args) => {
  if (args.tag === 'query-template') {
    return fetchQueryTemplates()
  }

  return metacards(ctx, {
    filterTree: {
      type: '=',
      property: 'metacard-tags',
      value: args.tag,
    },
    settings: args.settings,
  })
}

const metacardById = async (ctx, args) => {
  return metacards(ctx, {
    filterTree: {
      type: 'AND',
      filters: [
        {
          type: '=',
          property: 'id',
          value: args.id,
        },
        {
          type: 'LIKE',
          property: 'metacard-tags',
          value: '%',
        },
      ],
    },
    settings: args.settings,
  })
}

const user = async () => {
  const res = await fetch(`${ROOT}/user`)
  return res.json()
}

const sources = async () => {
  const res = await fetch(`${ROOT}/catalog/sources`)
  return res.json()
}

const metacardTypes = async () => {
  const res = await fetch(`${ROOT}/metacardtype`)
  const json = await res.json()

  const types = Object.keys(json).reduce((types, group) => {
    return Object.assign(types, json[group])
  }, {})

  return types
}

const facet = async (parent, args) => {
  const { attribute } = args

  const filterTree = {
    type: '=',
    property: 'anyText',
    value: '',
  }

  const q = {
    filterTree,
    count: 0,
    facets: [attribute],
  }

  const json = await send(q)

  const facet = json.facets[attribute]

  return facet
}

const Query = {
  user,
  sources,
  metacards,
  metacardsByTag,
  metacardById,
  metacardTypes,
  systemProperties,
  facet,
}

const createMetacard = async (parent, args) => {
  const { attrs } = args

  const body = {
    geometry: null,
    type: 'Feature',
    properties: fromGraphqlMap(attrs),
  }

  const res = await fetch(`${ROOT}/catalog/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const id = res.headers.get('id')
  const created = new Date().toISOString()
  const modified = created

  return toGraphqlMap({
    ...attrs,
    id,
    'metacard.created': created,
    'metacard.modified': modified,
    'metacard.owner': 'You',
  })
}

const saveMetacard = async (parent, args) => {
  const { id, attrs } = args

  const attributes = Object.keys(attrs).map(attribute => {
    const value = attrs[attribute]
    return {
      attribute: fromGraphqlName(attribute),
      values: Array.isArray(value) ? value : [value],
    }
  })

  const body = [
    {
      ids: [id],
      attributes,
    },
  ]

  const res = await fetch(`${ROOT}/metacards`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (res.ok) {
    const modified = new Date().toISOString()
    return toGraphqlMap({
      id,
      'metacard.modified': modified,
      ...attrs,
    })
  }
}

const deleteMetacard = async (parent, args) => {
  const { id } = args

  const res = await fetch(`${ROOT}/catalog/${id}`, {
    method: 'DELETE',
  })

  if (res.ok) {
    return id
  }
}

const updateUserPreferences = async (parent, args) => {
  const { userPreferences } = args

  const user = await fetch(`${ROOT}/user`)
  const json = await user.json()
  let previousPreferences = {}
  if (user.ok) {
    previousPreferences = json.preferences
  }

  const body = mergeDeepOverwriteLists(
    fromJS(previousPreferences),
    fromJS(removeTypename(userPreferences))
  ).toJS()

  const res = await fetch(`${ROOT}/user/preferences`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (res.ok) {
    return userPreferences
  }
}

const Mutation = {
  createMetacard,
  saveMetacard,
  deleteMetacard,
  updateUserPreferences,
}

const resolvers = {
  Query,
  Mutation,
}

const executableSchema = makeExecutableSchema({
  typeDefs: genSchema(),
  resolvers,
})

const serverLocation =
  process.env.SERVER_LOCATION || 'http://localhost:8080/graphql'

const defaultOptions = {
  ssrMode: false,
}

const createClient = (options = defaultOptions) => {
  const cache = new InMemoryCache()
  const { ssrMode } = options

  if (typeof window !== 'undefined') {
    cache.restore(window.__APOLLO_STATE__)
  }

  return new ApolloClient({
    link: ssrMode
      ? new SchemaLink({ schema: executableSchema })
      : new BatchHttpLink({ uri: serverLocation }),
    cache,
    ssrMode,
  })
}

module.exports = {
  createClient,
  resolvers,
}
