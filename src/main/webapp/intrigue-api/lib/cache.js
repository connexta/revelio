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

const startQuery = query => ({ type: 'query/START-QUERY', query })

const sourceError = response => ({
  type: 'query/SOURCE-ERROR',
  response,
})

const sourceReturned = response => ({
  type: 'query/SOURCE-RETURNED',
  response,
})

const clearQuery = queryId => ({ type: 'query/CLEAR-QUERY', queryId })

const executeQuery = ({ srcs, ...query }) => async (dispatch, getState) => {
  const { send } = getTransport(getState())

  dispatch(startQuery(query))

  const responses = srcs.map(async src => {
    try {
      const json = await send({ src, ...query })
      return dispatch(sourceReturned(json))
    } catch (e) {
      return dispatch(
        sourceError({ error: e, queryId: query.id, sourceId: src })
      )
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
    case 'query/START-QUERY':
      return state.set(action.query.id, action.query)
    case 'query/CLEAR-QUERY':
      return state.remove(action.queryId)
    default:
      return state
  }
}

// { queryId -> sourceId -> sourceResponse }
const sourceResponse = (state = Map(), action) => {
  switch (action.type) {
    case 'query/START-QUERY':
      return state.set(action.query.id, Map())
    case 'query/SOURCE-RETURNED': {
      const { types, results, ...sourceResponse } = action.response
      const queryId = action.response.id

      return state.update(queryId, map => {
        const sourceId = sourceResponse.status.id

        return map.set(sourceId, {
          ...sourceResponse,
          results: results.map(result => result.metacard.properties.id),
        })
      })
    }

    case 'query/CLEAR-QUERY':
      return state.remove(action.queryId)
    case 'query/SOURCE-ERROR': {
      const { queryId, sourceId, error } = action.response
      return state.setIn([queryId, sourceId], error)
    }

    default:
      return state
  }
}

// { [sourceId metacardId] -> result }
const results = (state = Map(), action) => {
  switch (action.type) {
    case 'query/SOURCE-RETURNED':
      const sourceId = action.response.status.id
      return state.withMutations(state => {
        action.response.results.forEach(result => {
          const metacardId = result.metacard.properties.id
          state.set([sourceId, metacardId], result)
        })
      })
    default:
      return state
  }
}

const types = (state = Map(), action) => {
  switch (action.type) {
    case 'query/SOURCE-RETURNED':
      return state.merge(action.response.types)
    default:
      return state
  }
}

const getSourceStatus = queryId => state => {
  const responses = getLocalState(state).sourceResponse.get(queryId)

  if (responses === undefined) {
    return {}
  }

  // { sourceId -> status }
  return responses.map(response => response.status).toJSON()
}

const getTypes = state => {
  return getLocatlState(state).types.toJSON()
}

const getQueryResponse = queryId => state => {
  return getLocalState(state)
    .sourceResponse.get(queryId)
    .toJSON()
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
    sourceResponse,
    types,
  }),
}

module.exports = {
  reducers,
  initTransport,
  closeTransport,
  executeQuery,
  getSourceStatus,
  getMetacards,
  rootStateKey,
}
