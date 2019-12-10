const ROOT = '/search/catalog/internal'

const typeDefs = `
  # Registered metacard attribute type
  type MetacardType {
    id: ID
    isInjected: Boolean
    multivalued: Boolean
    type: String
    enums: [String]
  }

  extend type Query {
    metacardTypes: [MetacardType]
  }
`

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

const getEnumerations = async (parent, args, { fetch, enumerations }) => {
  const { enumerations: enums } = await enumerations.getAllEnumerations({})

  const { enums: configEnums } = await (await fetch(`${ROOT}/config`)).json()

  Object.assign(enums, configEnums)

  return enums
}

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

const resolvers = {
  Query: {
    metacardTypes,
  },
}

module.exports = {
  resolvers,
  typeDefs,
}
