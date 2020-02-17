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
  sortPolicy: [
    {
      propertyName: 'modified',
      sortOrder: 'descending',
    },
  ],
}

const { createTransport } = require('./transport')

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
