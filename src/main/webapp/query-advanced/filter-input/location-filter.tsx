import * as React from 'react'
import { useState } from 'react'
import { QueryFilterProps } from '../filter/filter'
//@ts-ignore
import Location, { validate as validateLocation } from '../../location'
import { Map } from 'immutable'
import { AttributeMenu } from '../filter/filter-dropdowns'
import metacardDefinitions, { MetacardType } from './metacard-types'
import { getDefaultValue, filterComponentStyle } from '../filter/filter-utils'
//@ts-ignore
import { getLocationFilter } from '../../basic-search-helper'

//Consider removing in future commit
const isEmpty = (checkThis: any) => {
  return Object.keys(checkThis).length === 0
}

const LocationFilter = (props: QueryFilterProps) => {
  //Remove state in future commit
  const [location, setLocation] = useState(Map({ type: 'line' }))

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
      <Location
        value={location}
        onChange={(value: any) => {
          setLocation(value)
          if (isEmpty(validateLocation(value))) {
            props.onChange(getLocationFilter(value))
          }
        }}
      />
    </React.Fragment>
  )
}

export default LocationFilter
