const { Map, fromJS } = require('immutable')

export const APPLY_TO_KEY = 'applyTo'
export const DATATYPES_KEY = 'datatypes'
export const LOCATION_KEY = 'location'
export const TEXT_KEY = 'text'
export const TIME_RANGE_KEY = 'timeRange'

const timeProperties = [
  'created',
  'datetime.end',
  'datetime.start',
  'effective',
  'expiration',
  'metacard.created',
  'metacard.modified',
  'metacard.version.versioned-on',
  'modified',
]
const datatypeProperties = ['metadata-content-type', 'datatype']
export const fromFilterTree = filterTree => {
  return filterTree.filters.reduce((accumulator, filter) => {
    const { property, value, filters } = filter
    if (property === 'anyText') {
      return accumulator.set(TEXT_KEY, value)
    } else if (property === 'anyGeo') {
      return accumulator.set(
        LOCATION_KEY,
        fromJS({ value, geojson: filter.geojson })
      )
    } else if (filters && filters[0]) {
      if (timeProperties.includes(filters[0].property)) {
        return accumulator.set(
          TIME_RANGE_KEY,
          fromJS({
            ...filters[0],
            applyTo: filters.map(({ property }) => property),
          })
        )
      }

      if (datatypeProperties.includes(filters[0].property)) {
        const applyTo = new Set(filters.map(({ value }) => value))
        return accumulator.setIn([DATATYPES_KEY, APPLY_TO_KEY], [...applyTo])
      }
    }

    return accumulator
  }, Map())
}

export const toFilterTree = basicData => {
  const getTimeRangeFilter = () => {
    const { applyTo, ...rest } = basicData.get(TIME_RANGE_KEY).toJSON()
    if (!applyTo || !rest) {
      return null
    }
    return {
      type: 'OR',
      filters: applyTo.map(property => ({
        ...rest,
        property,
      })),
    }
  }

  const getDatatypesFilter = () => {
    const { applyTo } = basicData.get(DATATYPES_KEY).toJSON()
    if (!applyTo) {
      return null
    }
    const datatypeFilters = applyTo.map(value => ({
      type: 'ILIKE',
      property: 'datatype',
      value,
    }))
    const contentTypeFilters = applyTo.map(value => ({
      type: 'ILIKE',
      property: 'metadata-content-type',
      value,
    }))
    return {
      type: 'OR',
      filters: [...datatypeFilters, ...contentTypeFilters],
    }
  }

  const text = basicData.get(TEXT_KEY)
    ? {
        type: 'ILIKE',
        property: 'anyText',
        value: basicData.get(TEXT_KEY),
      }
    : null
  const location = basicData.get(LOCATION_KEY)
    ? {
        type: 'INTERSECTS',
        property: 'anyGeo',
        value: basicData.getIn([LOCATION_KEY, 'value']),
        geojson: basicData.getIn([LOCATION_KEY, 'geojson']),
      }
    : null
  const timeRange = getTimeRangeFilter()
  const datatypes = getDatatypesFilter()

  const filters = [text, location, timeRange, datatypes].filter(
    filter => filter !== null
  )

  return {
    type: 'AND',
    filters,
  }
}
