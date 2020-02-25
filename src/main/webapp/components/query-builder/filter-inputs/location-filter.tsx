import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'
import { makeDefaultSearchGeo } from '../filter'
import { Location, geoToFilter } from '../../../location'
import AttributeDropdown from '../filter/attribute-dropdown'
import { makeSearchGeoIdForFilter } from '../filter/search-geo-factory'
import { wktToGeo } from '../../../location/geo-to-wkt'

const getGeojson = (filter: QueryFilterProps['filter']) => {
  if (filter.geojson) return filter.geojson

  if (filter.value) {
    return wktToGeo({
      wkt: filter.value,
      id: makeSearchGeoIdForFilter(filter.value),
      buffer: filter.distance || 0,
      bufferUnit: 'meters',
    })
  }

  return makeDefaultSearchGeo()
}

const LocationFilter = (props: QueryFilterProps) => {
  const { filter } = props
  const geojson = getGeojson(filter)

  return (
    <React.Fragment>
      <AttributeDropdown {...props} />
      <Location
        value={geojson}
        onChange={value => {
          props.onChange(geoToFilter(value, filter.property))
        }}
      />
    </React.Fragment>
  )
}

export default LocationFilter
