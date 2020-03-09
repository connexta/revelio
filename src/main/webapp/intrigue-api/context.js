import { AuthenticationError } from 'apollo-server-errors'

import config from '../../configuration'
import createRpcClient from './rpc'
import fetch from './fetch'
import withChaos from './chaos'
import Cookies from 'universal-cookie'

const withExceptionLogger = (fn, logger) => async (...args) => {
  try {
    return await fn(...args)
  } catch (e) {
    logger.done({
      level: 'error',
      message: e.message,
      stack: e.stack,
    })

    throw e
  }
}

const withRpcLogger = (rpc, logger) => async (method, params) => {
  const profiler = logger
    .child({ type: 'jsonrpc-request', method })
    .startTimer()

  const fn = withExceptionLogger(rpc, profiler)

  const res = await fn(method, params)
  profiler.done({ message: 'Success' })
  return res
}

const withFetchLogger = (fetch, logger) => async (url, opts = {}) => {
  const { method = 'GET' } = opts

  const profiler = logger
    .child({ type: 'client-fetch', url, method })
    .startTimer()

  const fn = withExceptionLogger(fetch, profiler)

  const res = await fn(url, opts)
  const { status, statusText: message } = res
  profiler.done({ status, message })
  return res
}

const withAuth = (fetch, req) => async (url, opts = {}) => {
  const { authorization = '' } = req.headers
  const playgroundHeaders = authorization === '' ? {} : { authorization }

  const reqCookies = new Cookies(req.headers.cookie)
  const cookieVal = reqCookies.get('RSESSION')
  const cookie =
    cookieVal !== undefined
      ? { cookie: `${Buffer.from(cookieVal, 'base64').toString('ascii')}` }
      : {}

  const res = await fetch(url, {
    ...opts,
    headers: { ...opts.headers, ...cookie, ...playgroundHeaders },
  })

  if (res.status === 401) {
    throw new AuthenticationError('UNAUTHENTICATED')
  } else {
    return res
  }
}

const catalogMethods = {
  create: 'ddf.catalog/create',
  clone: 'ddf.catalog/clone',
  query: 'ddf.catalog/query',
  update: 'ddf.catalog/update',
  delete: 'ddf.catalog/delete',
  getSourceIds: 'ddf.catalog/getSourceIds',
  getSourceInfo: 'ddf.catalog/getSourceInfo',
}

const enumerationMethods = {
  getAllEnumerations: 'ddf.enumerations/all',
}

const generateRpcMethods = rpc => {
  const catalog = Object.keys(catalogMethods).reduce((catalog, method) => {
    catalog[method] = params => rpc(catalogMethods[method], params)
    return catalog
  }, {})

  const enumerations = Object.keys(enumerationMethods).reduce(
    (enumerations, method) => {
      enumerations[method] = params => rpc(enumerationMethods[method], params)
      return enumerations
    },
    {}
  )

  return { catalog, enumerations }
}

const getOperations = body => {
  if (body === undefined) {
    return []
  }

  if (Array.isArray(body)) {
    return body.map(({ operationName }) => operationName)
  }

  return body.operationName
}

const context = args => {
  const { req } = args

  req.logger.info({
    type: 'graphql-resolve',
    message: 'Running graphql query',
    operations: getOperations(req.body),
  })

  let wrappedFetch = withAuth(fetch, req)

  if (config('CHAOS_ENABLED')) {
    wrappedFetch = withChaos(wrappedFetch)
  }

  const rpc = withRpcLogger(createRpcClient(wrappedFetch), req.logger)

  return {
    fetch: withFetchLogger(wrappedFetch, req.logger),
    ...generateRpcMethods(rpc),
  }
}

export default context
