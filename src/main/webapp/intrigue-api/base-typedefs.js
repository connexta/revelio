const typeDefs = `
  # Arbitrary Json
  scalar Json
  # Binary content embedded as a base64 String
  scalar Binary
  # WKT embedded as a String
  scalar Geometry
  # XML embedded as a String
  scalar XML
  # ISO 8601 Data Time embedded as a String
  scalar Date

  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`
export default typeDefs
