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

const uglyMap = {
  minutes: howMany => `RELATIVE(PT${howMany}M)`,
  hours: howMany => `RELATIVE(PT${howMany}H)`,
  days: howMany => `RELATIVE(P${howMany}D)`,
  months: howMany => `RELATIVE(P${howMany}M)`,
  years: howMany => `RELATIVE(P${howMany}Y)`,
}

const relativeUnits = {
  P: {
    D: 'days',
    M: 'months',
    Y: 'years',
  },
  PT: {
    H: 'hours',
    M: 'minutes',
  },
}

// Create the Map
const unitsMap = Map(fromJS(relativeUnits))

const datatypeProperties = ['metadata-content-type', 'datatype']

export const fromFilterTree = filterTree => {
  return filterTree.filters.reduce((accumulator, filter) => {
    const { property, value, filters } = filter

    if (property === 'anyText') {
      return accumulator.set(TEXT_KEY, value)
    }

    if (property === 'anyGeo') {
      return accumulator.set(
        LOCATION_KEY,
        fromJS({ value, geojson: filter.geojson })
      )
    }

    if (filters && filters[0]) {
      if (timeProperties.includes(filters[0].property)) {
        if (filters[0].type === '=') {
          const { last, unit } = parseRelative(filters[0].value)
          filters[0].last = last
          filters[0].unit = unit
        }

        return accumulator.set(
          TIME_RANGE_KEY,
          Map({
            value: filters[0],
            applyTo: filters.map(({ property }) => property),
          })
        )
      }

      if (datatypeProperties.includes(filters[0].property)) {
        const applyTo = new Set(filters.map(({ value }) => value))
        return accumulator.set(DATATYPES_KEY, applyTo)
      }
    }

    return accumulator
  }, Map())
}

const parseRelative = relative => {
  const matches = relative.match(/RELATIVE\((\D*)(\d*)(\D*)\)/)
  if (matches && matches.length > 3) {
    const [full, timeOrDay, last, unitKey] = matches
    const unit = unitsMap.getIn([timeOrDay, unitKey])

    return { last, unit }
  }

  return {}
}

export const toFilterTree = basicData => {
  const getTimeRangeFilter = () => {
    const applyTo = basicData.getIn([TIME_RANGE_KEY, APPLY_TO_KEY])
    const rest = basicData.getIn([TIME_RANGE_KEY, 'value'])

    if (!applyTo || !rest) {
      return null
    }

    if (rest.type === '=') {
      const { last, unit } = rest
      rest.value = uglyMap[unit](last)
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
    const applyTo = basicData.get(DATATYPES_KEY)
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

  const text = basicData.has(TEXT_KEY)
    ? {
        type: 'ILIKE',
        property: 'anyText',
        value: basicData.get(TEXT_KEY),
      }
    : null

  const location = basicData.has(LOCATION_KEY)
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
