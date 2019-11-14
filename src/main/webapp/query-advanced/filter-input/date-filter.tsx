import * as React from 'react'
import { QueryFilterProps } from '../filter/filter'
const {
  TimeRangeAfter,
  TimeRangeBefore,
  TimeRangeDuring,
  TimeRangeRelative,
  validate,
} = require('../../time-range')
const { uglyMap, parseRelative } = require('../../basic-search-helper')
import { Map } from 'immutable'

export const comparatorOptions = ['BEFORE', 'AFTER', 'DURING', '=', 'IS NULL']

export const comparatorAliases = Map({
  BEFORE: 'Before',
  AFTER: 'After',
  DURING: 'Between',
  '=': 'Relative',
  'IS NULL': 'IS EMPTY',
})

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

const DateFilter = (props: QueryFilterProps) => {
  const toFilter = (timeRange: any) => {
    if (props.type === '=') {
      const { last, unit } = timeRange
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

  if (Component === undefined) {
    return null
  }

  return (
    <React.Fragment>
      <Component
        errors={validate({ ...value, type: props.type })}
        timeRange={value}
        setTimeRange={(value: any) => {
          props.onChange(toFilter(value))
        }}
      />
    </React.Fragment>
  )
}

export default DateFilter
