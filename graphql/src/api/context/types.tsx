import { Logger as WinstonLogger } from 'winston'
import { Fetch } from '../fetch/types'
import { RpcMethod, RpcResponse, EnumerationMethod } from '../rpc/types'
import nodeFetch from 'node-fetch'
export type LoggerType =
  | 'client-fetch'
  | 'jsonrpc-request'
  | 'graphql-resolve'
  | 'http-server-request'

export type Logger = {
  method: string
  type: LoggerType
  durationMs?: number
  operations: string[]
  url: string
  requestId: string
} & WinstonLogger
export type Request = {
  headers: any
}
type Operation = {
  operationName: string
}
export type Body = Operation | Operation[]
export type BaseContext = {
  fetch: Fetch
  nodeFetch: typeof nodeFetch
  catalog: Record<RpcMethod, RpcResponse>
  enumerations: Record<EnumerationMethod, RpcResponse>
}
