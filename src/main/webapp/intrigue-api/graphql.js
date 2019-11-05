const { ApolloClient } = require('apollo-client')
const { SchemaLink } = require('apollo-link-schema')
const { InMemoryCache } = require('apollo-cache-inmemory')
const { makeExecutableSchema } = require('graphql-tools')
const { createTransport } = require('./transport')
const { createHttpLink } = require('apollo-link-http')

const fetch = require('./fetch')

const ROOT = '/search/catalog/internal'

const { genSchema, toGraphqlName, fromGraphqlName } = require('./gen-schema')

const getBuildInfo = () => {
  /* eslint-disable */
  const commitHash = __COMMIT_HASH__
  const isDirty = __IS_DIRTY__
  const commitDate = __COMMIT_DATE__
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

const { send } = createTransport({
  host: 'localhost',
  port: 8993,
  protocol: 'https:',
  ...(typeof window !== 'undefined' ? window.location : {}),
  pathname: ROOT,
})

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
  const req = send(q)
  const json = await req.json()

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

  return Object.keys(types).map(k => types[k])
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

  const req = send(q)
  const json = await req.json()

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

  const res = await fetch(`./internal/user/preferences`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userPreferences),
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

const isServer = process.env.isServer || false
const serverLocation =
  process.env.serverLocation || 'http://localhost:4000/graphql'

const createClient = () => {
  const cache = new InMemoryCache()
  return new ApolloClient({
    link: isServer
      ? createHttpLink({ uri: serverLocation })
      : new SchemaLink({ schema: executableSchema }),
    cache,
  })
}

module.exports = {
  createClient,
  resolvers,
}
