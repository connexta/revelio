/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
import config from '../../configuration'
import url from 'url'
import qs from 'querystring'
import isomorphicFetch from 'isomorphic-fetch'
const ddfLocation = config('DDF_LOCATION')
const Origin = ddfLocation.href

import { Fetch, Options, Url } from './types'

const fetchRequest = async (
  url: Url,
  { headers = {}, ...opts } = {}
): Promise<Response> => {
  return isomorphicFetch(url, {
    credentials: 'same-origin',
    cache: 'no-cache',
    ...opts,
    headers: {
      'User-Agent': 'ace',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Origin,
      ...headers,
    },
  })
}

const withCacheBusting = (fetch: Fetch, ddfLocation: URL) => async (
  urlString: string,
  opts?: Options
): Promise<Response> => {
  const { query, ...rest } = url.parse(urlString)
  const { hostname, port, protocol } = ddfLocation

  const bustedUrl = url.format({
    ...rest,
    hostname,
    port,
    protocol,
    pathname: rest.pathname,
    search: '?' + qs.stringify({ ...qs.parse(query!), _: Date.now() }),
  })

  return await fetch(bustedUrl, opts)
}

const getAbortController = async (): Promise<any> => {
  return require('abort-controller').default
}

const withTimeout = (fetch: Fetch, timeout: number) => async (
  url: Url,
  opts?: Options
): Promise<Response> => {
  const AbortController = await getAbortController()
  const controller = new AbortController()
  const fetchReq = fetch(url, {
    signal: controller.signal,
    ...opts,
  })
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ message: 'Request exceeded desired timeout.' })
      controller.abort()
    }, timeout)
  })
  // The response will get cancelled before anything has a chance to try to access something on the
  // timeoutPromise
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return Promise.race([fetchReq, timeoutPromise])
}

const timeoutInterval = config('TIMEOUT_INTERVAL')
export default withTimeout(
  withCacheBusting(fetchRequest, ddfLocation),
  timeoutInterval
)
