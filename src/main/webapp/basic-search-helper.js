const { Map, fromJS } = require('immutable')

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
      return accumulator.set('text', value)
    } else if (property === 'anyGeo') {
      return accumulator.set(
        'location',
        fromJS({ value, geojson: filter.geojson })
      )
    } else if (filters && filters[0]) {
      if (timeProperties.includes(filters[0].property)) {
        return accumulator.set(
          'timeRange',
          fromJS({
            ...filters[0],
            applyTo: filters.map(({ property }) => property),
          })
        )
      }

      if (datatypeProperties.includes(filters[0].property)) {
        const applyTo = new Set(filters.map(({ value }) => value))
        return accumulator.setIn(['datatypes', 'applyTo'], [...applyTo])
      }
    }

    return accumulator
  }, Map())
}

export const toFilterTree = basicData => {
  const getTimeRangeFilter = () => {
    const { applyTo, ...rest } = basicData.get('timeRange').toJSON()
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
    const { applyTo } = basicData.get('datatypes').toJSON()
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

  const text = basicData.get('text')
    ? {
        type: 'ILIKE',
        property: 'anyText',
        value: basicData.get('text'),
      }
    : null
  const location = basicData.get('location')
    ? {
        type: 'INTERSECTS',
        property: 'anyGeo',
        value: basicData.getIn(['location', 'value']),
        geojson: basicData.getIn(['location', 'geojson']),
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
