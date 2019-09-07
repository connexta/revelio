import React from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { text, select } from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'
import { BasicSearch } from './basic-search'

import filterTree from './filterTree.json'

const stories = storiesOf('BasicSearch', module)

stories.add('basic', () => {
  return <BasicSearch onSearch={action('onSearch')} />
})

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
const fromFilterTree = filterTree => {
  return filterTree.filters.reduce((accumulator, filter) => {
    const { property, value, filters } = filter
    if (property === 'anyText') {
      accumulator.text = value
    } else if (property === 'anyGeo') {
      accumulator.location = { value, geojson: filter.geojson }
    } else if (filters && filters[0]) {
      if (timeProperties.includes(filters[0].property)) {
        accumulator.timeRange = {
          ...filters[0],
          applyTo: filters.map(({ property }) => property),
        }
      }

      if (datatypeProperties.includes(filters[0].property)) {
        const applyTo = new Set(filters.map(({ value }) => value))
        accumulator.datatypes = { applyTo: [...applyTo] }
      }
    }

    return accumulator
  }, {})
}

const toFilterTree = basicData => {
  const getTimeRangeFilter = () => {
    const { applyTo, ...rest } = basicData.timeRange
    if (!applyTo || !rest) {
      return null
    }
    return {
      type: 'OR',
      filters: applyTo.map(property => ({
        property,
        ...rest,
      })),
    }
  }

  const getDatatypesFilter = () => {
    const { applyTo } = basicData.datatypes
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

  const text = basicData.text
    ? {
        type: 'ILIKE',
        property: 'anyText',
        value: basicData.text,
      }
    : null
  const location = basicData.location
    ? {
        type: 'INTERSECTS',
        property: 'anyGeo',
        value: basicData.location.value,
        geojson: basicData.location.geojson,
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

console.log(toFilterTree(fromFilterTree(filterTree)))
