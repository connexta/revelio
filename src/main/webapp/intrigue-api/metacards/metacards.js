const genSchema = require('./gen-schema')

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
    attribute: String
    direction: Direction
  }

  type QuerySort {
    attribute: String
    direction: Direction
  }

  input QuerySettingsInput {
    src: String
    federation: String
    phonetics: Boolean
    sorts: [QuerySortInput]
    spellcheck: Boolean

    # Page size
    count: Int

    # Start of paging. First element is 1, not 0.
    start: Int
    type: String
  }

  type QuerySettings {
    src: [String]
    federation: String
    phonetics: Boolean
    sorts: [QuerySort]
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
    metacards(filterTree: Json!, settings: QuerySettingsInput): QueryResponse

    metacardsByTag(tag: String!, settings: QuerySettingsInput): QueryResponse
    metacardsById(ids: [ID]!, settings: QuerySettingsInput): [QueryResponse]

    # Get known values for a given attribute.
    #
    # NOTE: attributes need to be **whitelisted by an Admin** before they can be faceted
    facet(attribute: String!): [FacetResult]
  }

  extend type Mutation {
    createMetacard(attrs: MetacardAttributesInput!): MetacardAttributes
    saveMetacard(id: ID!, attrs: MetacardAttributesInput!): MetacardAttributes

    # TBD: Should only be used when...
    # createMetacardFromJson(attrs: Json!): MetacardAttributes
    # saveMetacardFromJson(id: ID!, attrs: Json!): MetacardAttributes

    deleteMetacard(id: ID!): ID
  }
`

const { transformFilterToCQL } = require('./CQLUtils')
import {
  getQueryTemplates,
  createQueryTemplate,
  saveQueryTemplate,
} from '../query-templates/query-templates'

const getCql = ({ filterTree, cql }) => {
  if (filterTree !== undefined) {
    return transformFilterToCQL(filterTree)
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

const lists = (id, fetch, toGraphqlName) => async () => {
  const res = await fetch(`${ROOT}/workspaces/${id}`)
  const data = await res.json()
  return data.lists !== undefined
    ? data.lists.map(list => renameKeys(toGraphqlName, list))
    : null
}

const metacards = async (parent, args, { catalog, toGraphqlName, fetch }) => {
  const q = { ...args.settings, filterTree: args.filterTree }
  const json = await catalog.query(processQuery(q))

  const attributes = json.results.map(result => {
    const properties = renameKeys(toGraphqlName, result.metacard.properties)
    return {
      ...properties,
      queries: queries(properties.queries),
      lists: lists(properties.id, fetch, toGraphqlName),
    }
  })
  json.status['elapsed'] = json.request_duration_millis
  return { attributes, ...json }
}

const metacardsByTag = async (parent, args, context) => {
  if (args.tag === 'query-template') {
    return await getQueryTemplates(parent, args, context)
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

const metacardsById = async (parent, args, context) => {
  return args.ids.map(id =>
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
  if (
    Array.isArray(attrs.metacard_tags) &&
    attrs.metacard_tags.includes('query-template')
  ) {
    return await createQueryTemplate(parent, args, context)
  }
  const { catalog, fromGraphqlName, toGraphqlName } = context

  const metacard = renameKeys(fromGraphqlName, attrs)

  const metacardsToCreate = {
    metacards: [
      {
        'metacard-type': attrs['metacardType'],
        attributes: metacard,
      },
    ],
  }

  const res = await catalog.create(metacardsToCreate)
  return renameKeys(toGraphqlName, res.createdMetacards[0].attributes)
}

const saveMetacard = async (parent, args, context) => {
  const { id, attrs } = args
  if (
    Array.isArray(attrs.metacard_tags) &&
    attrs.metacard_tags.includes('query-template')
  ) {
    return await saveQueryTemplate(parent, args, context)
  }

  const { fetch, fromGraphqlName, toGraphqlName } = context

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
    return renameKeys(toGraphqlName, {
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
