import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import { fromJS, getIn, removeIn, set, setIn } from 'immutable'
import { mergeDeepOverwriteLists } from '../utils'
const { BatchHttpLink } = require('apollo-link-batch-http')
const { genSchema, toGraphqlName, fromGraphqlName } = require('./gen-schema')

const ROOT = '/search/catalog/internal'

const filterDeepHelper = filterFunction => object =>
  object
    .filter(filterFunction)
    .map(
      object =>
        typeof object !== 'object' || object === null
          ? object
          : filterDeepHelper(filterFunction)(object)
    )

const filterDeep = filterFunction => object =>
  filterDeepHelper(filterFunction)(fromJS(object)).toJS()

const removeTypenameFields = object =>
  filterDeep((_, key) => key !== '__typename')(object)

const removeNullValues = object => filterDeep(value => value !== null)(object)

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

const systemProperties = async (parent, args, { fetch }) => {
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
  return { cql: cqlString, ...query }
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

const queries = (ids = []) => async (args, context) => {
  if (ids.length === 0) {
    return []
  }

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

  const res = await metacards({}, { filterTree }, context)

  return res.attributes.map(attrs => {
    const { filterTree } = attrs

    return {
      ...attrs,
      filterTree: () => JSON.parse(filterTree),
    }
  })
}

const metacards = async (parent, args, { catalog }) => {
  const q = { ...args.settings, filterTree: args.filterTree }
  const json = await catalog.query(processQuery(q))

  const attributes = json.results.map(result => {
    const properties = toGraphqlMap(result.metacard.properties)
    return {
      ...properties,
      queries: queries(properties.queries),
    }
  })
  json.status['elapsed'] = json.request_duration_millis
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

const fetchQueryTemplates = async (parent, args, { fetch }) => {
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

const metacardsByTag = async (parent, args, context) => {
  //TO-DO: Fix this to use graphql context
  if (args.tag === 'query-template') {
    return fetchQueryTemplates()
  }

  return metacards(
    parent,
    {
      filterTree: {
        type: '=',
        property: 'metacard-tags',
        value: args.tag,
      },
      settings: args.settings,
    },
    context
  )
}

const metacardById = async (parent, args, context) => {
  return metacards(
    parent,
    {
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
    },
    context
  )
}

const preferencesToGraphql = preferences => {
  const transformed = setIn(
    preferences,
    ['querySettings', 'detail_level'],
    getIn(preferences, ['querySettings', 'detail-level'])
  )
  return removeIn(transformed, ['querySettings', 'detail-level'])
}

const preferencesFromGraphql = preferences => {
  const transformed = setIn(
    preferences,
    ['querySettings', 'detail-level'],
    getIn(preferences, ['querySettings', 'detail_level'])
  )
  return removeIn(transformed, ['querySettings', 'detail_level'])
}

const user = async (parent, args, { fetch }) => {
  const res = await fetch(`${ROOT}/user`)
  const json = await res.json()

  return setIn(json, ['preferences'], () =>
    preferencesToGraphql(json.preferences)
  )
}

const getLocalCatalogId = async (parent, args, { fetch }) => {
  const res = await fetch(`${ROOT}/localcatalogid`)
  return res.json()
}

const sources = async (parent, args, context) => {
  const { catalog } = context
  const sourceIds = await catalog.getSourceIds({})
  const res = await catalog.getSourceInfo({ ids: sourceIds })
  //TO-DO: cache this in future, local catalog id doesn't change
  const local = await getLocalCatalogId(parent, args, context)

  return res.sourceInfo.map(source =>
    set(source, 'local', source.id === local['local-catalog-id'])
  )
}

const metacardStartingTypes = [
  {
    id: 'anyText',
    type: 'STRING',
    multivalued: false,
    isInjected: false,
    enums: [],
  },
  {
    id: 'anyGeo',
    type: 'LOCATION',
    multivalued: false,
    isInjected: false,
    enums: [],
  },
  {
    id: ' metacard-type',
    type: 'STRING',
    multivalued: false,
    isInjected: false,
    enums: [],
  },
  {
    id: 'source-id',
    type: 'STRING',
    multivalued: false,
    isInjected: false,
    enums: [],
  },
  {
    id: 'cached',
    type: 'STRING',
    multivalued: false,
    isInjected: false,
    enums: [],
  },
  {
    id: 'metacard-tags',
    type: 'STRING',
    multivalued: true,
    isInjected: false,
    enums: [],
  },
]

const metacardTypes = async (parent, args, { fetch, enumerations }) => {
  const res = await fetch(`${ROOT}/metacardtype`)
  const json = await res.json()

  const types = Object.keys(json).reduce((types, group) => {
    return Object.assign(types, json[group])
  }, {})
  const enums = await getEnumerations(parent, args, { fetch, enumerations })
  Object.keys(enums).forEach(attribute => {
    types[attribute].enums = enums[attribute]
  })
  return metacardStartingTypes.concat(Object.keys(types).map(k => types[k]))
}

const getEnumerations = async (parent, args, { fetch, enumerations }) => {
  const { enumerations: enums } = await enumerations.getAllEnumerations({})

  const { enums: configEnums } = await (await fetch(`${ROOT}/config`)).json()

  Object.assign(enums, configEnums)

  return enums
}

const facet = async (parent, args, { catalog }) => {
  const { attribute } = args

  const filterTree = {
    type: 'ILIKE',
    property: 'anyText',
    value: '%',
  }

  const q = {
    filterTree,
    count: 0,
    facets: [attribute],
  }

  const json = await catalog.query(processQuery(q))

  const facet = json.facets[attribute]

  return facet
}

const geofeature = async (parent, args, { fetch }) => {
  const response = await fetch(
    `${ROOT}/geofeature?id=${encodeURIComponent(args.id)}`
  )
  return response.json()
}

const suggestions = async (parent, args, { fetch }) => {
  const response = await fetch(
    `${ROOT}/geofeature/suggestions?q=${encodeURIComponent(args.q)}`
  )
  return response.json()
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
  suggestions,
  geofeature,
}

const createMetacard = async (parent, args, { catalog }) => {
  const { attrs } = args

  const metacard = fromGraphqlMap(attrs)

  const metacardsToCreate = {
    metacards: [
      {
        'metacard-type': attrs['metacard_type'],
        attributes: metacard,
      },
    ],
  }

  const res = await catalog.create(metacardsToCreate)
  return toGraphqlMap(res.created_metacards[0].attributes)
}
const saveMetacard = async (parent, args, { fetch }) => {
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

const deleteMetacard = async (parent, args, { catalog }) => {
  const { id } = args
  await catalog.delete({ ids: [id] })
  return id
}

const updateUserPreferences = async (parent, args, { fetch }) => {
  const { userPreferences } = args

  const user = await fetch(`${ROOT}/user`)
  const json = await user.json()
  let previousPreferences = {}
  if (user.ok) {
    previousPreferences = json.preferences
  }

  const body = mergeDeepOverwriteLists(
    fromJS(previousPreferences),
    fromJS(preferencesFromGraphql(removeTypenameFields(userPreferences)))
  ).toJS()

  const res = await fetch(`${ROOT}/user/preferences`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(removeNullValues(body)),
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

const btoa = arg => {
  if (typeof window !== 'undefined') {
    return window.btoa(arg)
  }
  return Buffer.from(arg).toString('base64')
}
const createServerApollo = () => {
  const cache = new InMemoryCache()
  return new ApolloClient({
    link: new SchemaLink({ schema: executableSchema }),
    ssrMode: true,
    cache,
  })
}

const createClientApollo = () => {
  const cache = new InMemoryCache()
  const auth = btoa('admin:admin')
  cache.restore(window.__APOLLO_STATE__)
  return new ApolloClient({
    link: new BatchHttpLink({
      uri: '/graphql',
      credentials: 'same-origin',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }),
    cache,
  })
}

module.exports = {
  createClientApollo,
  createServerApollo,
  resolvers,
}
