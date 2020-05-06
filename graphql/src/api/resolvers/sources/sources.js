import { set } from 'immutable'

const ROOT = '/search/catalog/internal'

const typeDefs = `
  type Source {
    isAvailable: Boolean
    # #### Determines if this source is the local catalog.
    local: Boolean
    catalogedTypes: [String]
    sourceId: ID
    actions: [String]
    version: String
  }

  extend type Query {
    sources: [Source]
  }
`

const getLocalCatalogId = async (parent, args, { fetch }) => {
  const res = await fetch(`${ROOT}/localcatalogid`)
  return res.json()
}

const sources = async (parent, args, context) => {
  const { catalog } = context
  const sourceIds = await catalog.getSourceIds({})
  const res = await catalog.getSourceInfo({ ids: sourceIds })
  //TO-DO: cache this in future, local catalog id doesn't change
  const local = await getLocalCatalogId(parent, args, context)
  return res.sourceInfo.map((source) =>
    set(source, 'local', source.sourceId === local['local-catalog-id'])
  )
}

const resolvers = {
  Query: {
    sources,
  },
}

module.exports = {
  resolvers,
  typeDefs,
}
