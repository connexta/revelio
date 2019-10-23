import * as React from 'react'
import { useState } from 'react'
import { QueryFilterProps } from '../filter/filter'
//@ts-ignore
import Location, { validate as validateLocation } from '../../location'
import { Map } from 'immutable'
//@ts-ignore
import { getLocationFilter } from '../../basic-search-helper'
import { Box } from '@material-ui/core'
import { filterComponentStyle } from '../filter/filter-utils'

//Consider removing in future commit
const isEmpty = (checkThis: any) => {
  return Object.keys(checkThis).length === 0
}

const LocationFilter = (props: QueryFilterProps) => {
  //Remove state in future commit
  const [location, setLocation] = useState(Map({ type: 'line' }))

  return (
    <React.Fragment>
      <Box style={filterComponentStyle}>
        <Location
          value={location}
          onChange={(value: any) => {
            setLocation(value)
            if (isEmpty(validateLocation(value))) {
              props.onChange(getLocationFilter(value))
            }
          }}
        />
      </Box>
    </React.Fragment>
  )
}

export default LocationFilter
