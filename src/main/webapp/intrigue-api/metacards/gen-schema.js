module.exports = (json = require('../attributes.json')) => {
  const toGraphqlName = name => name.replace(/-|\./g, '_')

  const attributes = json.concat([
    {
      id: 'metacard-type',
      multivalued: false,
      type: 'STRING',
    },
    {
      id: 'thumbnail',
      multivalued: false,
      type: 'STRING',
    },
  ])

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
    # Common and well known metacard attributes intended for progrmatic usage
    type MetacardAttributes {
    ${attrs()}
    }

    input MetacardAttributesInput {
    ${attrs(true)}
    }
    `
  }

  return {
    toGraphqlName,
    fromGraphqlName,
    typeDefs: genSchema(),
  }
}
