const fetch = require('isomorphic-fetch')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const defaultOptions = {
  protocol: 'https:',
  hostname: 'localhost',
  port: 8993,
  pathname: '/direct',
}

const createClient = (opts = defaultOptions) => {
  let id = 0

  const { protocol, hostname, port, pathname } = opts

  const auth = Buffer.from('admin:admin').toString('base64')

  const headers = {
    'User-Agent': 'jsonrpc',
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Basic ${auth}`,
    'Content-Type': 'application/json',
    Referer: `https://${hostname}:8993`,
  }

  const url = `${protocol}//${hostname}:${port}${pathname}`

  const request = async (method, params = {}) => {
    id++

    const req = {
      id,
      jsonrpc: '2.0',
      method,
      params,
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(req),
    })

    const { result, error } = await res.json()

    if (error) {
      const e = new Error(error.message)
      e.code = error.code
      e.data = error.data
      throw e
    }

    return result
  }

  return request
}

module.exports = createClient
