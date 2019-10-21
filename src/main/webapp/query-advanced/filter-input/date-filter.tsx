import * as React from 'react'
import { useState } from 'react'
//@ts-ignore
import TimeRange from '../../time-range'
import { QueryFilterProps } from '../filter/filter'
import { Map } from 'immutable'

export const comparatorOptions = ['BEFORE', 'AFTER', '=', 'DURING', 'IS EMPTY']

//@ts-ignore will eventually use props
const DateFilter = (props: QueryFilterProps) => {
  //Remove state in future commit
  const [date, setDate] = useState(Map({ type: 'BEFORE' }))

  return <TimeRange timeRange={date} setTimeRange={setDate} />
}

export default DateFilter
