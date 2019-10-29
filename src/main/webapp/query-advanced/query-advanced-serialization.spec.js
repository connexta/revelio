const assert = require('assert')
import { serialize, deserialize } from './query-advanced-serialization'

// Data stored by server
const serverIsNull = {
  property: 'an attribute',
  type: 'IS NULL',
  value: null,
}

const serverIsGreater = {
  property: 'an integer',
  type: '>',
  value: 12,
}

const serverRange = {
  property: 'a float',
  type: 'BETWEEN',
  lowerBoundary: 0.5,
  upperBoundary: 5.5,
  value: { lower: 0.5, upper: 5.5 },
}

const serverNear = {
  type: '=',
  value: true,
  property: {
    type: 'FILTER_FUNCTION',
    filterFunctionName: 'proximity',
    params: ['anyText', '2', 'a string'],
  },
}

const serverNestedFilter = {
  type: 'OR',
  filters: [serverIsNull, serverNear],
}

// Data stored by Query Advanced
const queryIsNull = {
  property: 'an attribute',
  type: 'IS NULL',
  value: '',
}

const queryIsGreater = {
  property: 'an integer',
  type: '>',
  value: '12',
}

const queryRange = {
  property: 'a float',
  type: 'BETWEEN',
  value: { lower: '0.5', upper: '5.5' },
}

const queryNear = {
  property: 'anyText',
  type: 'NEAR',
  value: { value: 'a string', distance: '2' },
}

const queryNestedFilter = {
  type: 'OR',
  filters: [queryIsNull, queryNear],
}

describe('serialization', () => {
  it('converts IS EMPTY', () => {
    assert.deepEqual(serialize(queryIsNull), serverIsNull)
  })
  it('converts > to integer', () => {
    assert.deepEqual(serialize(queryIsGreater), serverIsGreater)
  })
  it('converts range to floats', () => {
    assert.deepEqual(serialize(queryRange), serverRange)
  })
  it('converts NEAR ', () => {
    assert.deepEqual(serialize(queryNear), serverNear)
  })
  it('converts a nested filter', () => {
    assert.deepEqual(serialize(queryNestedFilter), serverNestedFilter)
  })
})

describe('deserialization', () => {
  it('converts IS EMPTY', () => {
    assert.deepEqual(deserialize(serverIsNull), queryIsNull)
  })
  it('converts NEAR', () => {
    assert.deepEqual(deserialize(serverNear), queryNear)
  })
  it('converts a nested filter', () => {
    assert.deepEqual(deserialize(serverNestedFilter), queryNestedFilter)
  })
})
