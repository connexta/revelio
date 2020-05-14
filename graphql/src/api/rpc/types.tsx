// This can be any java object.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<any, any> | Record<any, any>[]

export type RpcError = {
  code: number
  data: Json
} & Error

// RpcResponse as it stands now could be whatever the endpoint returns.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RpcResponse = any

export type RpcClient = (method: string, params: RpcParams) => RpcResponse

// Params are generic and can be different for each Rpc endpoint.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RpcParams = any

export type RpcMethod =
  | 'create'
  | 'query'
  | 'update'
  | 'delete'
  | 'getSourceIds'
  | 'getSourceInfo'

export type EnumerationMethod = 'getAllEnumerations'
