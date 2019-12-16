import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'
import Box from '@material-ui/core/Box'
import { makeDefaultSearchGeo } from '../filter'
import { filterComponentStyle } from '../filter/filter-utils'
import { Location, geoToFilter } from '../../location'

const LocationFilter = ({ onChange }: QueryFilterProps) => (
  <React.Fragment>
    <Box style={filterComponentStyle}>
      <Location
        value={makeDefaultSearchGeo()}
        onChange={value => onChange(geoToFilter(value))}
      />
    </Box>
  </React.Fragment>
)

export default LocationFilter
