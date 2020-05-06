const ROOT = '/search/catalog/internal'

const typeDefs = `
  type Suggestion {
    id: ID!
    name: String!
  }

  type GeoJSON {
    type: String!
    geometry: Json!
    properties: Json!
    id: String!
  }

  extend type Query {
    suggestions(q: String!): [Suggestion]
    geofeature(id: String!): GeoJSON
  }
`

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

const resolvers = {
  Query: {
    suggestions,
    geofeature,
  },
}

module.exports = {
  resolvers,
  typeDefs,
}
