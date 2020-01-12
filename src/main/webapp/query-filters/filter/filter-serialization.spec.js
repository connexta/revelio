const assert = require('assert')
import { serialize, deserialize } from './filter-serialization'
import { sampleAttributeDefinitions } from './dummyDefinitions'
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

describe('serialization', () => {
  it('converts IS EMPTY', () => {
    assert.deepEqual(
      serialize(queryIsNull, sampleAttributeDefinitions),
      serverIsNull
    )
  })
  it('converts > to integer', () => {
    assert.deepEqual(
      serialize(queryIsGreater, sampleAttributeDefinitions),
      serverIsGreater
    )
  })
  it('converts range to floats', () => {
    assert.deepEqual(
      serialize(queryRange, sampleAttributeDefinitions),
      serverRange
    )
  })
  it('converts NEAR ', () => {
    assert.deepEqual(
      serialize(queryNear, sampleAttributeDefinitions),
      serverNear
    )
  })
})

describe('deserialization', () => {
  it('converts IS EMPTY', () => {
    assert.deepEqual(
      deserialize(serverIsNull, sampleAttributeDefinitions),
      queryIsNull
    )
  })
  it('converts NEAR', () => {
    assert.deepEqual(
      deserialize(serverNear, sampleAttributeDefinitions),
      queryNear
    )
  })
})
