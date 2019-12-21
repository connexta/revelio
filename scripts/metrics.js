#!/usr/bin/env node

const ndjson = require('ndjson')

// collectors

const combine = fns => {
  const reducer = (state = {}, log) => {
    const ks = Object.keys(fns)

    return ks.reduce((state, key) => {
      const f = fns[key]
      const nextState = f(state[key], log)

      if (nextState === undefined) {
        return state
      }

      return { ...state, [key]: nextState }
    }, state)
  }

  return (state, log) => {
    if (log === undefined) {
      return state
    }
    return reducer(state, log)
  }
}

const statsByKey = (keyFn, statsFn) => (state = {}, log) => {
  const key = keyFn(log)

  if (key) {
    return { ...state, [key]: statsFn(state[key], log) }
  }

  return state
}

// aggregators

const totalRequests = (state = 0, log) => state + 1

const maxResponseTime = (state = 0, log) => Math.max(state, log.durationMs || 0)

const totalFailures = (state = 0, log) => {
  return log.level === 'error' ? state + 1 : state
}

const totalRpcRequests = (state = 0, log) =>
  log.type === 'jsonrpc-request' ? state + 1 : state

const totalFetchRequests = (state = 0, log) =>
  log.type === 'client-fetch' ? state + 1 : state

// compound aggregators

const graphQlStats = combine({
  totalRpcRequests,
  totalFetchRequests,
  graphQlQueries: (state = [], log) => {
    if (log.type === 'graphql-resolve') {
      return log.operations
    }
    return state
  },
  serverUrl: (state, log) => {
    if (log.type === 'http-server-request') {
      return log.method + ' ' + log.url
    }
    return state
  },
  responseTime: (state, log) => {
    if (log.type === 'http-server-request') {
      return log.durationMs
    }
    return state
  },
})

const stats = combine({
  totalRequests,
  maxResponseTime,
  totalFailures,
})

// key stats

const metricsByRequest = statsByKey(log => log.requestId, graphQlStats)

const fetchMetricsByUrl = statsByKey(log => {
  if (log.type === 'client-fetch') {
    return log.method + ' ' + log.url
  }
}, stats)

const serverMetricsByUrl = statsByKey(log => {
  if (log.type === 'http-server-request') {
    return log.method + ' ' + log.url
  }
}, stats)

const rpcMetricsByMethod = statsByKey(log => {
  if (log.type === 'jsonrpc-request') {
    return log.method
  }
}, stats)

const metricsByType = statsByKey(log => log.type, stats)

const metrics = combine({
  metricsByType,
  serverMetricsByUrl,
  fetchMetricsByUrl,
  rpcMetricsByMethod,
  metricsByRequest,
})

const keep = keyFn => stats => {
  const keys = Object.keys(stats)

  keys.sort((a, b) => (keyFn(stats[b]) > keyFn(stats[a]) ? 1 : -1))

  return keys.slice(0, 5).reduce((output, key) => {
    output[key] = stats[key]
    return output
  }, {})
}

const topMetrics = combine({
  serverMetricsByUrl: keep(x => x.maxResponseTime),
  metricsByRequest: keep(x => x.responseTime),
})

let state = {}

process.stdin.resume()
process.stdin
  .pipe(ndjson.parse())
  .on('data', log => {
    state = metrics(state, log)
  })
  .on('end', () => {
    const output = topMetrics(state, {})
    process.stdout.write(JSON.stringify(output, null, 2))
  })
