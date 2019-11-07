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

const url = require('url')
const qs = require('querystring')
const fetch = require('isomorphic-fetch')

const cacheBust = urlString => {
  const { query, ...rest } = url.parse(urlString)
  return url.format({
    ...rest,
    hostname: 'localhost',
    port: '8993',
    protocol: 'https:',
    ...(typeof window !== 'undefined' ? window.location : {}),
    pathname: rest.pathname,
    search: '?' + qs.stringify({ ...qs.parse(query), _: Date.now() }),
  })
}

module.exports = (url, { headers, ...opts } = {}) => {
  const auth = Buffer.from('admin:admin').toString('base64')

  return fetch(cacheBust(url), {
    credentials: 'same-origin',
    cache: 'no-cache',
    ...opts,
    headers: {
      'User-Agent': 'ace',
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      Referer: `https://localhost:8993`,
      ...headers,
    },
  })
}
