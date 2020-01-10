import createRpcClient from './rpc'
import fetch from './fetch'
import { AuthenticationError } from 'apollo-server-errors'

const context = args => {
  const { req } = args
  const cookie =
    req.headers.cookie !== undefined ? { cookie: req.headers.cookie } : {}
  const universalFetch = async (url, opts = {}) => {
    const res = await fetch(url, {
      ...opts,
      headers: {
        ...opts.headers,
        ...cookie,
      },
    })
    if (res.status === 401) {
      throw new AuthenticationError('UNAUTHENTICATED')
    } else {
      return res
    }
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
