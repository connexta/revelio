import * as React from 'react'
import { useState } from 'react'
import { QueryFilterProps } from '../filter/filter'
import { Map } from 'immutable'
const TimeRange = require('../../time-range').default

export const comparatorOptions = ['BEFORE', 'AFTER', '=', 'DURING', 'IS NULL']

//@ts-ignore will eventually use props
const DateFilter = (props: QueryFilterProps) => {
  //Remove state in future commit
  const [date, setDate] = useState(Map({ type: 'BEFORE' }))

  return <TimeRange timeRange={date} setTimeRange={setDate} />
}

export default DateFilter
