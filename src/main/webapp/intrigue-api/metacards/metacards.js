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
    # #### Query the Catalog Framework for Metcards.
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
    metacardById(id: ID!, settings: QuerySettingsInput): QueryResponse

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

const metacards = async (parent, args, { catalog, toGraphqlName }) => {
  const q = { ...args.settings, filterTree: args.filterTree }
  const json = await catalog.query(processQuery(q))

  const attributes = json.results.map(result => {
    const properties = renameKeys(toGraphqlName, result.metacard.properties)
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
  if (args.tag === 'query-template') {
    return fetchQueryTemplates(parent, args, context)
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

  const metacard = renameKeys(fromGraphqlName, attrs)

  const metacardsToCreate = {
    metacards: [
      {
        'metacard-type': attrs['metacard_type'],
        attributes: metacard,
      },
    ],
  }

  const res = await catalog.create(metacardsToCreate)
  return renameKeys(toGraphqlName, res.created_metacards[0].attributes)
}

const saveMetacard = async (parent, args, context) => {
  const { id, attrs } = args
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
    metacardById,
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
