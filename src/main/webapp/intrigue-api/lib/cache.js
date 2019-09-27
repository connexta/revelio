const { Map, List } = require('immutable')
const { combineReducers } = require('redux')

// transport

const { createTransport } = require('./transport')

const rootStateKey = 'query.reducer'

const getLocalState = state => state[rootStateKey]
// actions

const getTransport = state => getLocalState(state).transport

const initTransport = type => async (dispatch, getState) => {
  const transport = getTransport(getState())

  if (transport !== null) {
    await transport.close()
  }

  dispatch({
    type: 'query/SET-TRANSPORT',
    transport: createTransport({ type }),
  })
}

const closeTransport = () => async (dispatch, getState) => {
  const transport = getTransport(getState())

  if (transport !== null) {
    await transport.close()
  }

  dispatch({
    type: 'query/SET-TRANSPORT',
    transport: null,
  })
}

const runQuery = query => ({ type: 'query/RUN-QUERY', query })

const clearQuery = queryId => ({ type: 'query/CLEAR-QUERY', queryId })

const cancelQuery = (queryId, sourceId) => (dispatch, getState) => {
  const { sourceRequest } = getLocalState(getState())
  const id = List([queryId, sourceId])
  const request = sourceRequest.get(id)

  dispatch({
    type: 'query/SOURCE-CANCELED',
    queryId,
    sourceId,
  })

  if (request !== undefined) {
    request.abort()
  }
}

const getSourceStatus = (state, { queryId, sourceId }) => {
  const { sourceStatus } = getLocalState(state)
  return sourceStatus.getIn([queryId, sourceId])
}

const sleep = timeout =>
  new Promise(resolve => {
    setTimeout(resolve, timeout)
  })

const executeQuery = ({ srcs, ...query }) => async (dispatch, getState) => {
  const { send } = getTransport(getState())

  dispatch(runQuery({ srcs, ...query }))

  const responses = srcs.map(async src => {
    const sourceId = src
    const queryId = query.id

    const next = action => {
      dispatch({
        ...action,
        sourceId,
        queryId,
      })
    }

    try {
      const req = send({ src, ...query })

      next({
        type: 'query/SOURCE-START',
        request: req,
      })

      const json = await req.json()

      if (
        getSourceStatus(getState(), { queryId: query.id, sourceId: src }) ===
        'source.canceled'
      ) {
        return
      }

      next({ type: 'query/SOURCE-RETURNED' })

      if (
        getSourceStatus(getState(), { queryId: query.id, sourceId: src }) ===
        'source.canceled'
      ) {
        return
      }

      next({
        type: 'query/SOURCE-RESULTS',
        response: json,
      })
    } catch (e) {
      const status = getSourceStatus(getState(), {
        queryId: query.id,
        sourceId: src,
      })
      if (status === 'source.canceled') {
        return
      }
      return next({
        type: 'query/SOURCE-ERROR',
        response: {
          queryId,
          sourceId,
          error: e,
        },
      })
    }
  })

  return Promise.all(responses)
}

// reducers

const transport = (state = null, action) => {
  switch (action.type) {
    case 'query/SET-TRANSPORT':
      return action.transport
    default:
      return state
  }
}

// { queryId -> query }
const queries = (state = Map(), action) => {
  switch (action.type) {
    case 'query/RUN-QUERY':
      return state.set(action.query.id, action.query)
    case 'query/CLEAR-QUERY':
      return state.remove(action.queryId)
    default:
      return state
  }
}

// [queryId, sourceId] -> info
const sourceReducer = fn => (state = Map(), action) => {
  if (action.type === 'query/CLEAR-QUERY') {
    return state.remove(action.queryId)
  }

  if (action.queryId && action.sourceId) {
    const { queryId, sourceId } = action
    return state.updateIn([queryId, sourceId], state => {
      return fn(state, action)
    })
  }

  return state
}

const sourceRequest = sourceReducer((state, action) => {
  switch (action.type) {
    case 'query/SOURCE-START':
      return action.request

    case 'query/SOURCE-ERROR':
    case 'query/SOURCE-CANCELED':
    case 'query/SOURCE-RETURNED':
      return null

    default:
      return state
  }
})

//if you modify a query, running a specific source search should use the new criteria
// { queryId -> sourceId -> sourceResponse }
const sourceResponse = (state = Map(), action) => {
  switch (action.type) {
    case 'query/RUN-QUERY':
      return state.update(action.query.id, (responses = Map()) => {
        return responses.removeAll(action.query.srcs)
      })
    case 'query/SOURCE-RESULTS': {
      const { queryId, sourceId } = action
      const { types, results, ...sourceResponse } = action.response
      return state.update(queryId, (map = Map()) => {
        return map.set(sourceId, {
          ...sourceResponse,
          results: results.map(result => result.metacard.properties.id),
        })
      })
    }

    case 'query/CLEAR-QUERY':
      return state.remove(action.queryId)

    default:
      return state
  }
}

const sourceStatus = sourceReducer((state, action) => {
  const statusMap = Map({
    'query/SOURCE-START': 'source.pending',
    'query/SOURCE-RETURNED': 'source.success',
    'query/SOURCE-ERROR': 'source.error',
    'query/SOURCE-CANCELED': 'source.canceled',
  })

  return statusMap.get(action.type, state)
})

// { [sourceId metacardId] -> result }
const results = (state = Map(), action) => {
  switch (action.type) {
    case 'query/SOURCE-RESULTS':
      const sourceId = action.response.status.id
      return state.withMutations(state => {
        action.response.results.forEach(result => {
          const metacardId = result.metacard.properties.id
          state.set(metacardId, result)
        })
      })
    default:
      return state
  }
}

const types = (state = Map(), action) => {
  switch (action.type) {
    case 'query/SOURCE-RESULTS':
      return state.merge(action.response.types)
    default:
      return state
  }
}

const getQueryStatus = queryId => state => {
  const status = getLocalState(state).sourceStatus.get(queryId, Map())
  return status.toJSON()
}

const isQueryPending = queryId => state => {
  const pending = getLocalState(state)
    .sourceStatus.get(queryId, Map())
    .filter(status => status === 'source.pending')

  return pending.size !== 0
}

const getTypes = state => {
  return getLocatlState(state).types.toJSON()
}

const getQueryResponse = queryId => state => {
  const sourceResponse = getLocalState(state).sourceResponse.get(queryId, Map())

  const response = sourceResponse.get('ddf.distribution', { results: [] })

  return response.results.map(id => {
    return getLocalState(state).results.get(id)
  })
}

const getMetacards = state => {
  return getLocalState(state).results.toJSON()
}

const getMetacard = metacardId => state => {
  const metacard = getLocalState(state).results.get(metacardId)
  if (metacard !== undefined) {
    return metacard
  }
}

const reducers = {
  [rootStateKey]: combineReducers({
    transport,
    queries,
    results,
    sourceStatus,
    sourceRequest,
    sourceResponse,
    types,
  }),
}

module.exports = {
  reducers,
  initTransport,
  isQueryPending,
  clearQuery,
  cancelQuery,
  closeTransport,
  executeQuery,
  getQueryStatus,
  getMetacards,
  rootStateKey,
  getQueryResponse,
}
