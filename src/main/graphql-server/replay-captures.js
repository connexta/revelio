#!/usr/bin/env node

const fetch = require('isomorphic-fetch')
const { diffString } = require('json-diff')

const graphqlPost = async capture => {
  const { request } = capture

  const res = await fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Basic YWRtaW46YWRtaW4=',
    },
    body: JSON.stringify(request),
  })

  const response = await res.json()

  return { request, response }
}

const recapture = async captures => {
  const newCaptures = await Promise.all(captures.map(graphqlPost))
  const diff = diffString(captures, newCaptures)

  process.stdout.write(JSON.stringify(newCaptures, null, 2))

  if (diff !== '') {
    process.stderr.write(diff)
    process.exit(1)
  }
}

const main = () => {
  process.stdin.resume()
  let json = ''
  process.stdin.on('data', data => {
    json += data
  })
  process.stdin.on('end', () => {
    recapture(JSON.parse(json))
  })
}

main()
