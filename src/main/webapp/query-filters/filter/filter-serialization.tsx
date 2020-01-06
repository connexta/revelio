import { getDefaultValue } from './filter-utils'
import { getIn } from 'immutable'

export const deserialize = (filter: any, attributeDefinitions: any) => {
  const deserializedFilter = { ...filter }
  if (typeof filter.property === 'object') {
    // if the filter is something like NEAR (which maps to a CQL filter function such as 'proximity'),
    // there is an enclosing filter that creates the necessary '= TRUE' predicate, and the 'property'
    // attribute is what actually contains that proximity() call.
    const { filterFunctionName, params } = filter.property
    if (filterFunctionName !== 'proximity') {
      throw new Error(
        'Unsupported filter function in filter view: ' + filterFunctionName
      )
    }
    const [property, distance, value] = params
    deserializedFilter.property = property
    deserializedFilter.type = 'NEAR'
    deserializedFilter.value = { distance, value }
  }

  if (filter.type === 'BETWEEN') {
    deserializedFilter.value = {
      lower: filter.lowerBoundary,
      upper: filter.upperBoundary,
    }
  }
  if (filter.type === 'IS NULL' || filter.value == undefined) {
    deserializedFilter.value = getDefaultValue(
      getIn(
        attributeDefinitions.find(
          (metacardType: any) => metacardType.id === filter.property
        ),
        ['type'],
        'STRING'
      )
    )
  }
  return deserializedFilter
}
const generateFilterFunction = (filterFunctionName: string, params: any) => {
  return {
    type: '=',
    value: true,
    property: {
      type: 'FILTER_FUNCTION',
      filterFunctionName,
      params,
    },
  }
}

const generateIsEmptyFilter = (property: string) => {
  return {
    type: 'IS NULL',
    property,
    value: null,
  }
}

export const serialize = (filter: any, attributeDefinitions: any) => {
  switch (filter.type) {
    case 'NEAR':
      return generateFilterFunction('proximity', [
        filter.property,
        filter.value.distance,
        filter.value.value,
      ])
    case 'IS NULL':
      return generateIsEmptyFilter(filter.property)
  }

  switch (
    getIn(
      attributeDefinitions.find(
        (metacardType: any) => metacardType.id === filter.property
      ),
      ['type'],
      undefined
    )
  ) {
    case 'FLOAT':
    case 'DOUBLE':
      if (filter.type === 'BETWEEN') {
        return {
          ...filter,
          lowerBoundary:
            filter.value.lower === '' ? '' : parseFloat(filter.value.lower),
          upperBoundary:
            filter.value.upper === '' ? '' : parseFloat(filter.value.upper),
        }
      }
      return {
        ...filter,
        value: filter.value === '' ? '' : parseFloat(filter.value),
      }
    case 'INTEGER':
    case 'LONG':
    case 'SHORT':
      if (filter.type === 'BETWEEN') {
        return {
          ...filter,
          lowerBoundary:
            filter.value.lower === '' ? '' : parseInt(filter.value.lower),
          upperBoundary:
            filter.value.upper === '' ? '' : parseInt(filter.value.upper),
        }
      }
      return {
        ...filter,
        value: filter.value === '' ? '' : parseInt(filter.value),
      }
  }
  return { ...filter }
}
