const assert = require('assert')
import { transformValue } from './value-transformations'
import { parseRelative } from '../../basic-search-helper'

describe('NEAR', () => {
  it('converts from NEAR value format', () => {
    assert.equal(
      transformValue({
        propertyType: 'STRING',
        currentValue: { value: 'a value', distance: 5 },
        oldOperator: 'NEAR',
        newOperator: 'ILIKE',
      }),
      'a value'
    )
  })
  it('converts to NEAR value format', () => {
    assert.deepEqual(
      transformValue({
        propertyType: 'STRING',
        currentValue: 'a value',
        oldOperator: '=',
        newOperator: 'NEAR',
      }),
      {
        value: 'a value',
        distance: 2,
      }
    )
  })
})

describe('BETWEEN', () => {
  it('converts from BETWEEN value format', () => {
    assert.equal(
      transformValue({
        propertyType: 'INTEGER',
        currentValue: { lower: '1', upper: '5' },
        oldOperator: 'BETWEEN',
        newOperator: '>',
      }),
      '1'
    )
  })
  it('converts to BETWEEN value format', () => {
    assert.deepEqual(
      transformValue({
        propertyType: 'INTEGER',
        currentValue: '1',
        oldOperator: '>',
        newOperator: 'BETWEEN',
      }),
      {
        lower: '1',
        upper: '1',
      }
    )
  })
})

describe('RELATIVE', () => {
  it('converts from RELATIVE value format', () => {
    assert.equal(
      transformValue({
        propertyType: 'DATE',
        currentValue: 'RELATIVE(PT1M)',
        oldOperator: '=',
        newOperator: 'DURING',
      }),
      ''
    )
  })
  it('converts to RELATIVE value format', () => {
    const newValue = transformValue({
      propertyType: 'DATE',
      currentValue: '/',
      oldOperator: 'DURING',
      newOperator: '=',
    })
    const parsedValue = parseRelative(newValue)

    assert.notEqual(undefined, parsedValue.last)
    assert.notEqual(undefined, parsedValue.unit)
  })
  it('does not affect nondates', () => {
    assert.equal(
      transformValue({
        propertyType: 'STRING',
        currentValue: 'a value',
        oldOperator: '=',
        newOperator: 'ILIKE',
      }),
      'a value'
    )
    assert.equal(
      transformValue({
        propertyType: 'STRING',
        currentValue: 'a value',
        oldOperator: 'ILIKE',
        newOperator: '=',
      }),
      'a value'
    )
  })
})

describe('DURING', () => {
  it('converts from DURING value format', () => {
    const value = new Date().toISOString()
    assert.deepEqual(
      transformValue({
        propertyType: 'DATE',
        currentValue: `${value}/${value}`,
        oldOperator: 'DURING',
        newOperator: 'BEFORE',
      }),
      value
    )

    it('converts to DURING value format', () => {
      const value = new Date().toISOString()
      assert.deepEqual(
        transformValue({
          propertyType: 'DATE',
          currentValue: value,
          oldOperator: 'BEFORE',
          newOperator: 'DURING',
        }),
        `${value}/${value}`
      )
    })
  })
})
