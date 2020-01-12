import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'
import { makeDefaultSearchGeo } from '../filter'
import { Location, geoToFilter } from '../../location'
import AttributeDropdown from '../filter/attribute-dropdown'

const LocationFilter = (props: QueryFilterProps) => (
  <React.Fragment>
    <AttributeDropdown {...props} />
    <Location
      //TODO: re-type QueryFilter to allow for more complex filters than
      //      just {property, type, value} ex. location (geojson) and
      //      filter functions such as NEAR (currently be serialized)
      value={props.geojson || makeDefaultSearchGeo()}
      onChange={value => {
        props.onChange(geoToFilter(value, props.property))
      }}
    />
  </React.Fragment>
)

export default LocationFilter
