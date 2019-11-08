import * as React from 'react'
import { QueryFilterProps } from '../filter/filter'
const {
  default: TimeRange,
  createTimeRange,
  validate,
} = require('../../time-range')
const { uglyMap, parseRelative } = require('../../basic-search-helper')

export const comparatorOptions = ['BEFORE', 'AFTER', '=', 'DURING', 'IS NULL']

const fromFilter = (filter: any) => {
  if (filter.type === '=') {
    const { last, unit } = parseRelative(filter.value)
    return createTimeRange({
      last,
      unit,
      type: filter.type,
    })
  }

  if (filter.type === 'DURING') {
    const dates = filter.value.split('/')
    return createTimeRange({
      type: filter.type,
      from: new Date(dates[0]),
      to: new Date(dates[1]),
    })
  }
  const { value, type } = filter

  return createTimeRange({ value, type })
}

const DateFilter = (props: QueryFilterProps) => {
  const toFilter = (timeRange: any) => {
    if (timeRange.type === '=') {
      const { last, unit } = timeRange
      return {
        property: props.property,
        value: uglyMap[unit](last),
        type: timeRange.type,
      }
    }
    if (timeRange.type === 'DURING') {
      const { from, to } = timeRange
      return {
        property: props.property,
        value: `${new Date(from).toISOString()}/${new Date(to).toISOString()}`,
        type: timeRange.type,
      }
    }
    return {
      property: props.property,
      value: timeRange.value,
      type: timeRange.type,
    }
  }
  const value = fromFilter(props)
  return (
    <TimeRange
      errors={validate(value)}
      timeRange={value}
      setTimeRange={(value: any) => {
        props.onChange(toFilter(value))
      }}
    />
  )
}

export default DateFilter
