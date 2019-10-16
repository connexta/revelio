import * as React from 'react'
import { useState } from 'react'
//@ts-ignore
import TimeRange from '../../time-range'
import { QueryFilterProps } from '../filter/filter'
import { AttributeMenu } from '../filter/filter-dropdowns'
import { metacardDefinitions, MetacardType } from '../filter/dummyDefinitions'
import { getDefaultValue, filterComponentStyle } from '../filter/filter-utils'
import { Map } from 'immutable'

const DateFilter = (props: QueryFilterProps) => {
  //Remove state in future commit
  const [date, setDate] = useState(Map({ type: 'BEFORE' }))

  return (
    <React.Fragment>
      <AttributeMenu
        onChange={(newProperty: MetacardType) => {
          const { property, type, value } = props
          const prevType = metacardDefinitions.get(property)
          const newType = metacardDefinitions.get(newProperty)
          if (prevType !== newType) {
            props.onChange({
              type,
              property: newProperty,
              value: getDefaultValue(newType),
            })
          } else {
            props.onChange({ type, value, property: newProperty })
          }
        }}
        style={{ width: '48%', float: 'left', ...filterComponentStyle }}
        selected={props.property}
      />

      <TimeRange timeRange={date} setTimeRange={setDate} />
    </React.Fragment>
  )
}

export default DateFilter
