import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'
const {
  TimeRangeAfter,
  TimeRangeBefore,
  TimeRangeDuring,
  TimeRangeRelative,
  validate,
} = require('../../components/time-range')
const {
  uglyMap,
  parseRelative,
} = require('../../components/basic-search/basic-search-helper')
import AttributeDropdown from '../filter/attribute-dropdown'

import ComparatorDropdown from '../filter/comparator-dropdown'
import { Box } from '@material-ui/core'

const getDate = (value: any) => {
  if (value == null) return null
  const date = new Date(value)
  if (!isNaN(date.valueOf())) {
    return date
  }
  return null
}

const toISOString = (value: any) => {
  if (value == null) return ''
  const date = new Date(value)
  if (!isNaN(date.valueOf())) {
    return date.toISOString()
  }
  return ''
}

const comparatorsToComponents: any = {
  BEFORE: TimeRangeBefore,
  AFTER: TimeRangeAfter,
  '=': TimeRangeRelative,
  DURING: TimeRangeDuring,
  'IS NULL': null,
}

const fromFilter = (filter: any) => {
  const timeRange: any = {}
  switch (filter.type) {
    case 'BEFORE':
    case 'AFTER':
      timeRange.value = getDate(filter.value)
      break
    case '=':
      const { last, unit } = parseRelative(filter.value)
      timeRange.last = last
      timeRange.unit = unit
      break
    case 'DURING':
      const dates = filter.value.split('/')
      timeRange.from = getDate(dates[0])
      timeRange.to = getDate(dates[1])
      break
  }

  return timeRange
}

const toDuringValue = (value: any) => {
  if (value == null) return ''
  const date = new Date(value)
  if (!isNaN(date.valueOf())) {
    return `${date.toISOString()}/${date.toISOString()}`
  }
  return ''
}

const fromDuringValue = (value: string) => {
  const dates = value.split('/')
  const from = new Date(dates[0])
  if (!isNaN(from.valueOf())) {
    return from.toISOString()
  }

  return ''
}
const default_relative_value = 'RELATIVE(PT1M)'

const FROM: any = {
  DURING: (value: any) => fromDuringValue(value),
  '=': () => '',
  'IS NULL': () => '',
}

const TO: any = {
  DURING: (value: any) => toDuringValue(value),
  '=': () => default_relative_value,
  'IS NULL': () => null,
}

const DateFilter = (props: QueryFilterProps) => {
  const { filter } = props
  const toFilter = (timeRange: any) => {
    if (filter.type === '=') {
      const { last, unit } = timeRange
      if (!uglyMap[unit] || !last.match(/^(-?\d*$)|^$/)) {
        return { ...filter }
      }
      return {
        ...filter,
        value: uglyMap[unit](last),
      }
    }
    if (filter.type === 'DURING') {
      const { from, to } = timeRange

      return {
        ...filter,
        value: `${toISOString(from)}/${toISOString(to)}`,
      }
    }
    return {
      ...filter,
      value: toISOString(timeRange.value),
    }
  }
  const value = fromFilter(filter)
  const Component = comparatorsToComponents[filter.type]

  return (
    <React.Fragment>
      <AttributeDropdown {...props} />
      <ComparatorDropdown
        {...props}
        onChange={(newOperator: string) => {
          const { type: oldOperator, value: oldValue } = filter
          if (oldOperator === newOperator) return
          let newValue = oldValue
          if (FROM[oldOperator] !== undefined) {
            newValue = FROM[oldOperator](newValue)
          }
          if (TO[newOperator] !== undefined) {
            newValue = TO[newOperator](newValue)
          }
          props.onChange({
            type: newOperator,
            value: newValue,
            property: filter.property,
          })
        }}
      />
      {filter.type !== 'IS NULL' && (
        <Box style={{ margin: 5 }}>
          <Component
            errors={validate({ ...value, type: filter.type })}
            timeRange={value}
            setTimeRange={(value: any) => {
              props.onChange(toFilter(value))
            }}
          />
        </Box>
      )}
    </React.Fragment>
  )
}

export default DateFilter
