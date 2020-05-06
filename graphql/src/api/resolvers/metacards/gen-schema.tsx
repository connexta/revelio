import { Attribute, Schema, DDFType } from './types'

export default (json = require('./attributes.json') as Attribute[]): Schema => {
  const toGraphqlName = (name: string): string => name.replace(/-|\./g, '_')

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

  const idMap = attributes
    .map((a) => a.id)
    .reduce((map, id) => {
      map[toGraphqlName(id)] = id
      return map
    }, {} as Record<string, string>)

  const fromGraphqlName = (name: string): string => idMap[name] || name

  // DDF types -> GraphQL types
  const typeMap: Record<DDFType, string> = {
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

  const attrs = (input?: boolean): string =>
    attributes
      .map((attr) => {
        const { id, multivalued, type } = attr
        const name = toGraphqlName(id)
        // eslint-disable-next-line
        // @ts-ignore If the type is `MetacardAttributes` it will fall to the `type` via the || operator.
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
