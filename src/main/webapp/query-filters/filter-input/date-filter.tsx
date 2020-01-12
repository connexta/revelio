import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'
const {
  TimeRangeAfter,
  TimeRangeBefore,
  TimeRangeDuring,
  TimeRangeRelative,
  validate,
} = require('../../time-range')
const { uglyMap, parseRelative } = require('../../basic-search-helper')
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
  const toFilter = (timeRange: any) => {
    if (props.type === '=') {
      const { last, unit } = timeRange
      if (!uglyMap[unit] || !last.match(/^(-?\d*$)|^$/)) {
        return {
          property: props.property,
          value: props.value,
          type: props.type,
        }
      }
      return {
        property: props.property,
        value: uglyMap[unit](last),
        type: props.type,
      }
    }
    if (props.type === 'DURING') {
      const { from, to } = timeRange

      return {
        property: props.property,
        value: `${toISOString(from)}/${toISOString(to)}`,
        type: props.type,
      }
    }
    return {
      property: props.property,
      value: toISOString(timeRange.value),
      type: props.type,
    }
  }
  const value = fromFilter(props)
  const Component = comparatorsToComponents[props.type]

  return (
    <React.Fragment>
      <AttributeDropdown {...props} />
      <ComparatorDropdown
        {...props}
        onChange={(newOperator: string) => {
          const { property, type: oldOperator, value: oldValue } = props
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
            property,
          })
        }}
      />
      {props.type !== 'IS NULL' && (
        <Box style={{ margin: 5 }}>
          <Component
            errors={validate({ ...value, type: props.type })}
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
