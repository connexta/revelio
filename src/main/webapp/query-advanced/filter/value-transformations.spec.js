const assert = require('assert')
import { FROM, TO } from './value-transformations'

describe('NEAR', () => {
  it('converts from NEAR value format', () => {
    assert.equal(FROM['NEAR']({ value: 'a value', distance: 5 }), 'a value')
  })
  it('converts to NEAR value format', () => {
    assert.deepEqual(TO['NEAR']('a value'), {
      value: 'a value',
      distance: 2,
    })
  })
})

describe('BETWEEN', () => {
  it('converts from BETWEEN value format', () => {
    assert.equal(FROM['BETWEEN']({ lower: '1', upper: '5' }), '1')
  })
  it('converts to BETWEEN value format', () => {
    assert.deepEqual(TO['BETWEEN']('1'), {
      lower: '1',
      upper: '1',
    })
  })
})
