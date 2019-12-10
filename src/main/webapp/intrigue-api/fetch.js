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
const url = require('url')
const qs = require('querystring')
const fetch = require('isomorphic-fetch')
const ddfLocation = url.parse(
  process.env.DDF_LOCATION || 'https://localhost:8993'
)

const cacheBust = urlString => {
  const { query, ...rest } = url.parse(urlString)
  const { hostname, port, protocol } = ddfLocation
  return url.format({
    ...rest,
    hostname,
    port,
    protocol,
    ...(typeof window !== 'undefined' ? window.location : {}),
    pathname: rest.pathname,
    search: '?' + qs.stringify({ ...qs.parse(query), _: Date.now() }),
  })
}

module.exports = (url, { headers, ...opts } = {}) => {
  return fetch(cacheBust(url), {
    credentials: 'same-origin',
    cache: 'no-cache',
    ...opts,
    headers: {
      'User-Agent': 'ace',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Referer: ddfLocation.href,
      ...headers,
    },
  })
}
