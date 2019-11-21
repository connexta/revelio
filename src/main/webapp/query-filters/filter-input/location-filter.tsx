import * as React from 'react'
import { useState } from 'react'
import { QueryFilterProps } from '../filter/individual-filter'
import { Map } from 'immutable'
import { Box } from '@material-ui/core'
import { filterComponentStyle } from '../filter/filter-utils'
const getLocationFilter = require('../../basic-search-helper').getLocationFilter
const validateLocation = require('../../location').validate
const Location = require('../../location').default

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
              const filter = getLocationFilter(value)
              if (filter) {
                props.onChange(getLocationFilter(value))
              }
            }
          }}
        />
      </Box>
    </React.Fragment>
  )
}

export default LocationFilter
