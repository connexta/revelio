const json = require('./attributes.json')

const getTypeDefs = () => {
  if (typeof window === 'undefined') {
    // prevent webpack from resolving fs/path which is only required for node
    const r = eval('require')
    const fs = r('fs')
    const path = r('path')
    const schema = path.join(__dirname, 'schema.graphql')
    return fs.readFileSync(schema)
  } else {
    return require('raw-loader!./schema.graphql')
  }
}

const toGraphqlName = name => name.replace(/-|\./g, '_')

const attributes = json.concat({
  id: 'metacard-type',
  multivalued: false,
  type: 'STRING',
})

const idMap = attributes.map(a => a.id).reduce((map, id) => {
  map[toGraphqlName(id)] = id
  return map
}, {})

const fromGraphqlName = name => idMap[name] || name

// DDF types -> GraphQL types
const typeMap = {
  STRING: 'String',
  DOUBLE: 'Float',
  INTEGER: 'Int',
  LONG: 'Int',
  BOOLEAN: 'Boolean',
  BINARY: 'Binary',
  GEOMETRY: 'Geometry',
  XML: 'XML',
  DATE: 'Date',
  JSON: 'Json',
}

const attrs = input =>
  attributes
    .map(attr => {
      const { id, multivalued, type } = attr
      const name = toGraphqlName(id)
      let graphQLType = typeMap[type] || type + (input ? 'Input' : '')

      if (multivalued) {
        graphQLType = `[${graphQLType}]`
      }

      return `  # metacard attribute: **\`${id}\`**\n  ${name}: ${graphQLType}`
    })
    .join('\n')

const genSchema = () => {
  return `
  scalar Json
  # Binary content embedded as a base64 String
  scalar Binary
  # WKT embedded as a String
  scalar Geometry
  # XML embedded as a String
  scalar XML
  # ISO 8601 Data Time embedded as a String
  scalar Date

  # Common and well known metacard attributes intended for progrmatic usage
  type MetacardAttributes {
  ${attrs()}
  }

  input MetacardAttributesInput {
  ${attrs(true)}
  }

  ${getTypeDefs()}
  `
}

module.exports = {
  toGraphqlName,
  fromGraphqlName,
  genSchema,
}
