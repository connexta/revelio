const assert = require('assert')
import { serialize, deserialize } from './query-advanced-serialization'
import { sampleMetacardTypes } from './filter/dummyDefinitions'
// Data stored by server
const serverIsNull = {
  property: 'topic.vocabulary',
  type: 'IS NULL',
  value: null,
}

const serverIsGreater = {
  property: 'ext.population',
  type: '>',
  value: 12,
}

const serverRange = {
  property: 'media.bit.rate',
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
    params: ['topic.vocabulary', '2', 'a string'],
  },
}

const serverNestedFilter = {
  type: 'OR',
  filters: [serverIsNull, serverNear],
}

// Data stored by Query Advanced
const queryIsNull = {
  property: 'topic.vocabulary',
  type: 'IS NULL',
  value: '',
}

const queryIsGreater = {
  property: 'ext.population',
  type: '>',
  value: '12',
}

const queryRange = {
  property: 'media.bit.rate',
  type: 'BETWEEN',
  value: { lower: '0.5', upper: '5.5' },
}

const queryNear = {
  property: 'topic.vocabulary',
  type: 'NEAR',
  value: { value: 'a string', distance: '2' },
}

const queryNestedFilter = {
  type: 'OR',
  filters: [queryIsNull, queryNear],
}

describe('serialization', () => {
  it('converts IS EMPTY', () => {
    assert.deepEqual(serialize(queryIsNull, sampleMetacardTypes), serverIsNull)
  })
  it('converts > to integer', () => {
    assert.deepEqual(
      serialize(queryIsGreater, sampleMetacardTypes),
      serverIsGreater
    )
  })
  it('converts range to floats', () => {
    assert.deepEqual(serialize(queryRange, sampleMetacardTypes), serverRange)
  })
  it('converts NEAR ', () => {
    assert.deepEqual(serialize(queryNear, sampleMetacardTypes), serverNear)
  })
  it('converts a nested filter', () => {
    assert.deepEqual(
      serialize(queryNestedFilter, sampleMetacardTypes),
      serverNestedFilter
    )
  })
})

describe('deserialization', () => {
  it('converts IS EMPTY', () => {
    assert.deepEqual(
      deserialize(serverIsNull, sampleMetacardTypes),
      queryIsNull
    )
  })
  it('converts NEAR', () => {
    assert.deepEqual(deserialize(serverNear, sampleMetacardTypes), queryNear)
  })
  it('converts a nested filter', () => {
    assert.deepEqual(
      deserialize(serverNestedFilter, sampleMetacardTypes),
      queryNestedFilter
    )
  })
})
