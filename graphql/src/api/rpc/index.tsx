import { Fetch } from '../fetch/types'
import {
  RpcMethod,
  RpcResponse,
  RpcError,
  RpcParams,
  EnumerationMethod,
} from './types'
export const catalogMethods: Record<RpcMethod, string> = {
  create: 'ddf.catalog/create',
  query: 'ddf.catalog/query',
  update: 'ddf.catalog/update',
  delete: 'ddf.catalog/delete',
  getSourceIds: 'ddf.catalog/getSourceIds',
  getSourceInfo: 'ddf.catalog/getSourceInfo',
}
export const enumerationMethods: Record<EnumerationMethod, string> = {
  getAllEnumerations: 'ddf.enumerations/all',
}

const createClient = (fetch: Fetch) => {
  let id = 0
  const url = '/direct'

  const request = async (
    method: string,
    params: RpcParams
  ): Promise<RpcResponse> => {
    id++

    const req = {
      id,
      jsonrpc: '2.0',
      method,
      params,
    }

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(req),
    })

    const { result, error } = await res.json()

    if (error) {
      const e = new Error(error.message) as RpcError
      e.code = error.code
      e.data = error.data
      throw e
    }

    return result
  }

  return request
}

export default createClient
