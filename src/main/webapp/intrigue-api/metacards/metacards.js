const genSchema = require('./gen-schema')
import { setIn, updateIn, merge } from 'immutable'

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

  type QuerySettings {
    sourceIds: [String]
    federation: String
    phonetics: Boolean
    sortPolicy: [QuerySort]
    spellcheck: Boolean
    detail_level: String
    type: String
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
    # All known metacard attributes with raw attributes names.
    # This is intended for views that are interested in:
    # 1. Using raw attribute names.
    # 2. Attribute aliasing that require raw attribute names.
    # 3. Getting all the possible attributes.
    metacard: Json
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

    # Get known values for a given attribute.
    #
    # NOTE: attributes need to be **whitelisted by an Admin** before they can be faceted
    facet(attribute: String!): [FacetResult]
  }

  extend type Mutation {
    createMetacard(attrs: MetacardAttributesInput!): MetacardAttributes
    saveMetacard(id: ID!, attributes: MetacardAttributesInput!): MetacardAttributes

    # TBD: Should only be used when...
    # createMetacardFromJson(attrs: Json!): MetacardAttributes
    # saveMetacardFromJson(id: ID!, attrs: Json!): MetacardAttributes
    cloneMetacard(id: ID!): MetacardAttributes
    deleteMetacard(id: ID!): ID
  }
`

const { transformFilterToCQL } = require('./CQLUtils')

const WILDCARD_FITLER = {
  property: 'anyText',
  type: 'ILIKE',
  value: '%',
}

const getCql = ({ filterTree, cql }) => {
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
  return res.attributes
}

const lists = (id, fetch, toGraphqlName) => async () => {
  const res = await fetch(`${ROOT}/workspaces/${id}`)
  const data = await res.json()
  return data.lists !== undefined
    ? data.lists.map(list => renameKeys(toGraphqlName, list))
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

const isDefaultThumbnailAction = action => {
  return action.url.endsWith('?transform=thumbnail')
}

const isEmptyThumbnail = thumbnail => {
  return thumbnail === undefined || thumbnail === null || thumbnail === ''
}

const createThumbnailUrl = result => {
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

const metacards = async (parent, args, { catalog, toGraphqlName, fetch }) => {
  const q = { ...args.settings, filterTree: args.filterTree }
  const json = await catalog.query(processQuery(q))

  const attributes = json.results.map(result => {
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

  const results = json.results.map(result => {
    const withUuidActions = updateIn(result, ['actions'], actions => {
      return actions.map(action =>
        makeActionIdUnique(result.metacard.attributes.id, action)
      )
    })
    const thumbnail = createThumbnailUrl(result)
    if (thumbnail !== undefined) {
      return setIn(
        withUuidActions,
        ['metacard', 'attributes', 'thumbnail'],
        thumbnail
      )
    } else {
      return withUuidActions
    }
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
    args.ids.map(id =>
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
  return renameKeys(toGraphqlName, {
    ...res.createdMetacards[0].attributes,
    filterTree:
      res.createdMetacards[0].attributes.filterTree &&
      JSON.parse(res.createdMetacards[0].attributes.filterTree),
  })
}

const saveMetacard = async (parent, args, context) => {
  const { id } = args
  let attributes = args.attributes

  const [oldMetacard] = await metacardsById(
    parent,
    { ids: [id], ...args },
    context
  )
  const [oldMetacardAttrs] = oldMetacard.attributes
  const { catalog, fromGraphqlName, toGraphqlName } = context
  if (attributes.filterTree) {
    attributes = setIn(
      attributes,
      ['filterTree'],
      JSON.stringify(attributes.filterTree)
    )
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

const resolvers = {
  Query: {
    metacards,
    metacardsByTag,
    metacardsById,
    facet,
  },
  Mutation: {
    createMetacard,
    saveMetacard,
    deleteMetacard,
    cloneMetacard,
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
