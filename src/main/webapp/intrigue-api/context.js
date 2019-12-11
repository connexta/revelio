import createRpcClient from './rpc'
import fetch from './fetch'

const context = args => {
  const { req } = args

  const { authorization = '' } = req.headers
  const universalFetch = (url, opts = {}) => {
    return fetch(url, {
      ...opts,
      headers: {
        ...opts.headers,
        authorization,
      },
    })
  }
  const request = createRpcClient(universalFetch)

  const catalogMethods = {
    create: 'ddf.catalog/create',
    query: 'ddf.catalog/query',
    update: 'ddf.catalog/update',
    delete: 'ddf.catalog/delete',
    getSourceIds: 'ddf.catalog/getSourceIds',
    getSourceInfo: 'ddf.catalog/getSourceInfo',
  }
  const enumerationMethods = {
    getAllEnumerations: 'ddf.enumerations/all',
  }

  const catalog = Object.keys(catalogMethods).reduce((catalog, method) => {
    catalog[method] = params => request(catalogMethods[method], params)
    return catalog
  }, {})

  const enumerations = Object.keys(enumerationMethods).reduce(
    (enumerations, method) => {
      enumerations[method] = params =>
        request(enumerationMethods[method], params)
      return enumerations
    },
    {}
  )
  return { catalog, fetch: universalFetch, enumerations }
}

export default context
