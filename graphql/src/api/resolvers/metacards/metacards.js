import genSchema from './gen-schema'
import { setIn, updateIn, merge, getIn } from 'immutable'

import { transformFilterToCQL } from './CQLUtils'
const ROOT = '/search/catalog/internal'

const typeDefs = `
  enum Direction {
    # Smaller to Larger values
    asc
    # Smaller to Larger values
    ascending
    # Larger to Smaller values
    desc
    # Larger to Smaller values
    descending
  }

  input QuerySortInput {
    propertyName: String
    sortOrder: Direction
  }

  type QuerySort {
    propertyName: String
    sortOrder: Direction
  }

  input QuerySettingsInput {
    sourceIds: [String]
    federation: String
    phonetics: Boolean
    sortPolicy: [QuerySortInput]
    spellcheck: Boolean

    # Result Form Name
    detail_level: String

    # Page size
    pageSize: Int

    # Start of paging. First element is 1, not 0.
    startIndex: Int
    type: String
  }

  type DefaultSearchForm {
    id: ID
  }

  type QuerySettings {
    sourceIds: [String]
    federation: String
    phonetics: Boolean
    sortPolicy: [QuerySort]
    spellcheck: Boolean
    detail_level: String
    type: String
    template: DefaultSearchForm
  }

  input QueryRequest {
    filterTree: Json
  }

  type QueryResponseStatus {
    count: Int
    elapsed: Int
    hits: Int
    id: ID
    successful: Boolean
  }

  type MetacardAction {
    description: String
    displayName: String
    id: ID
    title: String
    url: String
  }

  type QueryResponseResult {
    actions: [MetacardAction]
    isSubscribed: Boolean
    # All known metacard attributes with raw attributes names.
    # This is intended for views that are interested in:
    # 1. Using raw attribute names.
    # 2. Attribute aliasing that require raw attribute names.
    # 3. Getting all the possible attributes.
    metacard: Json
    id: ID
  }

  type QueryResponse {
    results: [QueryResponseResult]
    attributes: [MetacardAttributes]
    status: QueryResponseStatus
  }

  type FacetResult {
    count: Int
    value: String
  }

type ExportFormats {
    id: String
    displayName: String
}

  extend type Query {
    # #### Query the Catalog Framework for Metacards.
    #
    # Below is an example filterTree to query for all resource Metacards:
    #
    # \`\`\`javascript
    # {
    #   "type": "=",
    #   "property": "anyText",
    #   "value": "*"
    # }
    # \`\`\`
    #
    # If no metacard tag is specified in the filterTree, **only resource metacards** will be returned.
    metacards(filterTree: Json, settings: QuerySettingsInput): QueryResponse

    metacardsByTag(tag: String!, settings: QuerySettingsInput): QueryResponse
    metacardsById(ids: [ID]!, settings: QuerySettingsInput): [QueryResponse]
    metacardById(id: ID!): MetacardAttributes


    # Get known values for a given attribute.
    #
    # NOTE: attributes need to be **whitelisted by an Admin** before they can be faceted
    facet(attribute: String!): [FacetResult]
    exportOptions(transformerType: String!): [ExportFormats]
  }

  extend type Mutation {
    createMetacard(attrs: MetacardAttributesInput!): MetacardAttributes
    saveMetacard(id: ID!, attributes: MetacardAttributesInput!): MetacardAttributes

    # TBD: Should only be used when...
    # createMetacardFromJson(attrs: Json!): MetacardAttributes
    # saveMetacardFromJson(id: ID!, attrs: Json!): MetacardAttributes
    cloneMetacard(id: ID!): MetacardAttributes
    deleteMetacard(id: ID!): ID
    exportResult(source: String!, id: ID!, transformer: String!): Json 
    exportResultSet(transformer: String!, ids: [ID]!, srcs: [String]! opts: Json): Json
    subscribeToWorkspace(id: ID!): Int 
    unsubscribeFromWorkspace(id: ID!): Int 
  }
`

const WILDCARD_FITLER = {
  property: 'anyText',
  type: 'ILIKE',
  value: '%',
}

const getCql = ({ filterTree, cql }) => {
  const checkForEmptySearch =
    Array.isArray(getIn(filterTree, ['filters'], 0)) &&
    getIn(filterTree, ['filters', 'length'], 0) === 0

  if (checkForEmptySearch) {
    return transformFilterToCQL(WILDCARD_FITLER)
  }
  if (filterTree != undefined) {
    return transformFilterToCQL(filterTree)
  }

  if (cql != undefined) {
    return cql
  }

  return transformFilterToCQL(WILDCARD_FITLER)
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

const queries = (ids = []) => async (args, context) => {
  if (ids.length === 0) {
    return []
  }

  const filters = ids.map((id) => {
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

  // This is a recursive function, has to be used before it's defined.
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const res = await metacards({}, { filterTree }, context)
  return res.attributes
}

const lists = (id, fetch, toGraphqlName) => async () => {
  const res = await fetch(`${ROOT}/workspaces/${id}`)
  const data = await res.json()
  return data.lists !== undefined
    ? data.lists.map((list) => renameKeys(toGraphqlName, list))
    : null
}

const makeActionIdUnique = (id, action) => {
  return {
    ...action,
    id: action.id + '-' + id,
  }
}

const isThumbnailAction = ({ id }) => {
  return id === 'catalog.data.metacard.thumbnail'
}

const isDefaultThumbnailAction = (action) => {
  return action.url.endsWith('?transform=thumbnail')
}

const isEmptyThumbnail = (thumbnail) => {
  return thumbnail === undefined || thumbnail === null || thumbnail === ''
}

const createThumbnailUrl = (result) => {
  const action = result.actions.find(isThumbnailAction)

  if (action && !isDefaultThumbnailAction(action)) {
    return action.url
  }

  const thumbnail = result.metacard.attributes.thumbnail

  if (isEmptyThumbnail(thumbnail)) {
    return undefined
  }

  return 'data:image/jpeg;base64,' + thumbnail
}

const getResultFormAttributes = async (parent, context, resultFormID) => {
  if (!resultFormID || resultFormID === 'All Fields') return null
  try {
    // This is a recursive function, has to be used before it's defined.
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const [resultFormMetacard] = await metacardsById(
      parent,
      { ids: [resultFormID] },
      context
    )
    const [resultFormAttributes] = resultFormMetacard.attributes
    return resultFormAttributes['ui_attribute_group']
  } catch (e) {
    //eslint-disable-next-line
    console.log(e)
    return null
  }
}

const filterResultFormAttributes = (attributes, resultFormAttributes) => {
  if (!resultFormAttributes) return attributes
  return Object.keys(attributes).reduce((acc, current) => {
    if (resultFormAttributes.includes(current) || current === 'id') {
      return { ...acc, [current]: attributes[current] }
    }
    return acc
  }, {})
}

const metacards = async (parent, args, context) => {
  const { catalog, toGraphqlName, fetch } = context
  const q = { ...args.settings, filterTree: args.filterTree }
  const originalQuery = catalog.query(processQuery(q))
  const resultFormQuery = getResultFormAttributes(
    parent,
    context,
    args.settings && args.settings.detail_level
  )
  const [json, resultFormAttributes] = await Promise.all([
    originalQuery,
    resultFormQuery,
  ])

  const attributes = json.results.map((result) => {
    const attributes = renameKeys(toGraphqlName, result.metacard.attributes)
    const { filterTree } = attributes
    return {
      ...attributes,
      queries: queries(attributes.queries),
      lists: lists(attributes.id, fetch, toGraphqlName),
      thumbnail: createThumbnailUrl(result),
      filterTree: () => filterTree && JSON.parse(filterTree),
    }
  })

  const results = json.results.map((result) => {
    result = setIn(result, ['id'], result.metacard.attributes.id)
    const withUuidActions = updateIn(result, ['actions'], (actions) => {
      return actions.map((action) =>
        makeActionIdUnique(result.metacard.attributes.id, action)
      )
    })

    const thumbnail = createThumbnailUrl(result)

    const withThumbnail =
      thumbnail !== undefined
        ? setIn(
            withUuidActions,
            ['metacard', 'attributes', 'thumbnail'],
            thumbnail
          )
        : withUuidActions

    const requestedAttributes = filterResultFormAttributes(
      withThumbnail.metacard.attributes,
      resultFormAttributes
    )
    return setIn(withThumbnail, ['metacard', 'attributes'], requestedAttributes)
  })

  json.status['elapsed'] = json.request_duration_millis
  return { attributes, ...json, results }
}

const metacardsByTag = async (parent, args, context) => {
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

const metacardsById = async (parent, args, context) => {
  return await Promise.all(
    args.ids.map((id) =>
      metacards(
        parent,
        {
          filterTree: {
            type: 'AND',
            filters: [
              {
                type: '=',
                property: 'id',
                value: id,
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
    )
  )
}

const metacardById = async (parent, args, context) => {
  const [metacard] = await metacardsById(parent, { ids: [args.id] }, context)
  return metacard.attributes
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

const exportOptions = async (parent, args, { fetch }) => {
  const res = await fetch(`${ROOT}/transformers/${args.transformerType}`)
  const exportFormats = await res.json()
  return exportFormats.sort((format1, format2) => {
    if (format1.displayName > format2.displayName) {
      return 1
    }

    if (format1.displayName < format2.displayName) {
      return -1
    }

    return 0
  })
}

const createMetacard = async (parent, args, context) => {
  const { attrs } = args

  const { catalog, fromGraphqlName, toGraphqlName } = context

  const metacard = renameKeys(fromGraphqlName, {
    ...attrs,
    filterTree: attrs.filterTree && JSON.stringify(attrs.filterTree),
  })
  const metacardsToCreate = {
    metacards: [
      {
        metacardType: attrs['metacard_type'],
        attributes: metacard,
      },
    ],
  }
  const res = await catalog.create(metacardsToCreate)

  const createdMetacard = renameKeys(toGraphqlName, {
    ...res.createdMetacards[0].attributes,
    filterTree:
      res.createdMetacards[0].attributes.filterTree &&
      JSON.parse(res.createdMetacards[0].attributes.filterTree),
  })

  const securityAttributes = [
    'security_access_individuals_read',
    'security_access_individuals',
    'security_access_groups_read',
    'security_access_groups',
  ]
  securityAttributes.forEach((securityAttr) => {
    createdMetacard[securityAttr] = []
  })
  return createdMetacard
}

const saveMetacard = async (parent, args, context) => {
  const { id } = args
  let attributes = args.attributes
  const { catalog, fromGraphqlName, toGraphqlName } = context

  const [oldMetacard] = await metacardsById(
    parent,
    { ids: [id], ...args },
    context
  )
  let [oldMetacardAttrs] = oldMetacard.attributes
  if (typeof oldMetacardAttrs.queries === 'function') {
    const queries = await oldMetacardAttrs.queries({}, context)
    oldMetacardAttrs = {
      ...oldMetacardAttrs,
      queries: (queries || []).map((query) => query.id),
    }
  }
  if (attributes.filterTree) {
    attributes = setIn(
      attributes,
      ['filterTree'],
      JSON.stringify(attributes.filterTree)
    )
  }

  if (attributes.queries) {
    const queries = attributes.queries.map((query) => query.id)
    attributes = setIn(attributes, ['queries'], queries)
  }

  const newMetacardAttrs = merge(oldMetacardAttrs, attributes)

  const body = {
    metacards: [
      {
        ids: [id],
        metacardType: args.attributes.metacard_type,
        attributes: renameKeys(fromGraphqlName, newMetacardAttrs),
      },
    ],
  }

  const res = await catalog.update(body)

  if (res) {
    const modified = new Date().toISOString()
    return renameKeys(toGraphqlName, {
      id,
      'metacard.modified': modified,
      'metacard.owner': newMetacardAttrs.metacard_owner,
      ...res.updatedMetacards[0].attributes,
      filterTree:
        res.updatedMetacards[0].attributes.filterTree &&
        JSON.parse(res.updatedMetacards[0].attributes.filterTree),
      queries:
        res.updatedMetacards[0].attributes.queries &&
        res.updatedMetacards[0].attributes.queries.map((id) => ({ id })),
    })
  }
}

const cloneMetacard = async (parent, args, context) => {
  const { catalog, toGraphqlName } = context
  const { id } = args
  const res = await catalog.clone({ id })
  return renameKeys(toGraphqlName, {
    ...res.createdMetacards[0].attributes,
    filterTree:
      res.createdMetacards[0].attributes.filterTree &&
      JSON.parse(res.createdMetacards[0].attributes.filterTree),
  })
}

const deleteMetacard = async (parent, args, { catalog }) => {
  const { id } = args
  await catalog.delete({ ids: [id] })
  return id
}

const exportResult = async (parent, args, { fetch }) => {
  const { id, source, transformer } = args
  const response = await fetch(
    `/services/catalog/sources/${source}/${id}?transform=${transformer}`
  )
  const type = 'data:' + response.headers.get('content-type')
  const fileName = response.headers
    .get('content-disposition')
    .split('filename=')[1]
    .replace(/"/g, '')
  const buffer = await response.buffer()
  return { type, fileName, buffer }
}

const getResultSetCql = (ids) => {
  const queries = ids.map((id) => `(("id" ILIKE '${id}'))`)
  return `(${queries.join(' OR ')})`
}

const exportResultSet = async (parent, args, { fetch }) => {
  const { transformer, ids, srcs, opts } = args
  const cql = getResultSetCql(ids)
  const count = ids.length
  const body = opts ? { cql, srcs, count, args: opts } : { cql, srcs, count }
  const response = await fetch(`${ROOT}/cql/transform/${transformer}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const type = 'data:' + response.headers.get('content-type')
  const fileName = response.headers
    .get('content-disposition')
    .split('filename=')[1]
    .replace(/"/g, '')
  const buffer = await response.buffer()
  return { type, fileName, buffer }
}

const subscribeToWorkspace = async (parent, args, { fetch }) => {
  const { id } = args
  const res = await fetch(`${ROOT}/subscribe/${id}`, { method: 'POST' })
  return res.status
}

const unsubscribeFromWorkspace = async (parent, args, { fetch }) => {
  const { id } = args
  const res = await fetch(`${ROOT}/unsubscribe/${id}`, { method: 'POST' })
  return res.status
}

const resolvers = {
  Query: {
    metacards,
    metacardsByTag,
    metacardsById,
    metacardById,
    facet,
    exportOptions,
  },
  Mutation: {
    createMetacard,
    saveMetacard,
    deleteMetacard,
    cloneMetacard,
    exportResult,
    exportResultSet,
    subscribeToWorkspace,
    unsubscribeFromWorkspace,
  },
}

module.exports = () => {
  const schema = genSchema()
  const { toGraphqlName, fromGraphqlName } = schema

  return {
    resolvers,
    typeDefs: [typeDefs, schema.typeDefs],
    context: () => {
      return {
        toGraphqlName,
        fromGraphqlName,
      }
    },
  }
}
