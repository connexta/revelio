import { AuthenticationError } from 'apollo-server-errors'

import config from '../../configuration'
import fetch from '../fetch'
import withChaos from '../chaos'
import Cookies from 'universal-cookie'
import { Profiler } from 'winston'
import nodeFetch from 'node-fetch'
import {
  RpcClient,
  RpcMethod,
  RpcParams,
  RpcResponse,
  EnumerationMethod,
} from '../rpc/types'
import createRpcClient, { catalogMethods, enumerationMethods } from '../rpc'
import { Logger, Request, Body, BaseContext } from './types'
import { Fetch, Options } from '../fetch/types'

/**
 * Type asserted version of Object.keys that doesn't assume the keys are strings, but instead are the type of the key for the record.
 */
const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[]

const withExceptionLogger = (fn: any, logger: Profiler) => async (
  ...args: any[]
) => {
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

const withRpcLogger = (rpc: RpcClient, logger: Logger) => async (
  method: string,
  params: RpcParams
): Promise<RpcResponse> => {
  const profiler = logger
    .child({ type: 'jsonrpc-request', method })
    .startTimer()

  const fn = withExceptionLogger(rpc, profiler)

  const res = await fn(method, params)
  profiler.done({ message: 'Success' })
  return res
}

const withFetchLogger = (fetch: Fetch, logger: Logger) => async (
  url: URL,
  opts: Options = {}
): Promise<any> => {
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

const withAuth = (fetch: Fetch, req: Request) => async (
  url: URL,
  opts: Options = {}
): Promise<Response> => {
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

const generateRpcMethods = (
  rpc: RpcClient
): {
  catalog: Record<RpcMethod, RpcResponse>
  enumerations: Record<EnumerationMethod, RpcResponse>
} => {
  const catalog = keys(catalogMethods).reduce((catalog, method) => {
    catalog[method] = (params: RpcParams): RpcResponse =>
      rpc(catalogMethods[method], params)
    return catalog
  }, {} as Record<RpcMethod, RpcResponse>)

  const enumerations = keys(enumerationMethods).reduce(
    (enumerations, method) => {
      enumerations[method] = (params: RpcParams): RpcResponse =>
        rpc(enumerationMethods[method], params)
      return enumerations
    },
    {} as Record<EnumerationMethod, RpcResponse>
  )

  return { catalog, enumerations }
}

const getOperations = (body: Body): string | string[] => {
  if (body === undefined) {
    return []
  }

  if (Array.isArray(body)) {
    return body.map(({ operationName }) => operationName)
  }

  return body.operationName
}

const context = (args: any): BaseContext => {
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
    nodeFetch,
    ...generateRpcMethods(rpc),
  }
}

export default context
