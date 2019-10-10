/* eslint-disable */

const assert = require('assert')

const query = {
  id: '313a84858daa4ef5980d4b11a745d6d3',
  srcs: ['ddf.distribution'],
  start: 1,
  count: 250,
  cql: {
    property: 'anyText',
    type: 'ILIKE',
    value: '*',
  },
  sorts: [
    {
      attribute: 'modified',
      direction: 'descending',
    },
  ],
}

const { createTransport } = require('./lib/transport')

const transportTests = type => () => {
  it('should successfully createTransport', async () => {
    const { send, close } = createTransport({ type })
    const json = await send(query)
    close()
  })
  it('should fail to query on port 12345', async () => {
    const { send, close } = createTransport({
      type,
      port: 12345,
      wsOpts: { reconnect: false },
    })
    try {
      const json = await send(query)
    } catch (e) {
      return
    }
    throw Error('Exception was not thrown')
  })
}

describe('transport', () => {
  describe('http', transportTests('http'))
  describe('ws', transportTests('ws'))
  it('should not connect to unknown transports', () => {
    assert.throws(() => createTransport({ type: 'test' }), Error)
  })
})

const { combineReducers, createStore, applyMiddleware } = require('redux')
const thunk = require('redux-thunk').default
const {
  reducer,
  executeQuery,
  getSourceStatus,
  getMetacards,
  initTransport,
  closeTransport,
} = require('./lib/cache')

const createCache = () => createStore(reducer, applyMiddleware(thunk))

const cacheTests = type => () => {
  it('should init and query', async () => {
    const store = createCache()

    const actions = [initTransport(type), executeQuery(query), closeTransport()]

    for (let i = 0; i < actions.length; i++) {
      await store.dispatch(actions[i])
    }

    //console.log(store.getState())
  })
}

describe('cache', () => {
  describe('http', cacheTests('http'))
  describe('ws', cacheTests('ws'))
})
