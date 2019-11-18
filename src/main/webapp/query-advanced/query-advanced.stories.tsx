const { storiesOf } = require('../@storybook/react')
import QueryAdvanced from './query-advanced'
import * as React from 'react'
import { action } from '@storybook/addon-actions'
import { withKnobs, number } from '@storybook/addon-knobs'
const stories = storiesOf('Query Advanced', module)
import { useState } from 'react'
import FilterGroup from './filter/filter-group'

const baseFilter = {
  property: 'created',
  type: 'DURING',
  value: '2019-10-13T17:36:00.000Z/2019-10-30T17:36:00.000Z',
}

const baseFilterGroup = {
  type: 'AND',
  filters: [baseFilter],
}

const nearFilter = {
  type: '=',
  value: true,
  property: {
    type: 'FILTER_FUNCTION',
    filterFunctionName: 'proximity',
    params: ['topic.vocabulary', '2', 'hello there'],
  },
}

const rangeFilter = {
  type: 'BETWEEN',
  property: 'ext.population',
  value: '',
  lowerBoundary: 1,
  upperBoundary: 5,
}

const deserializedFilters = {
  type: 'OR',
  filters: [nearFilter, rangeFilter],
}

stories.addDecorator(withKnobs)
stories.add('basic', () => {
  const [filterTree, setFilterTree] = useState(baseFilterGroup)

  return (
    <FilterGroup
      limitDepth={number('Nesting Depth', 1)}
      {...filterTree}
      onChange={setFilterTree}
    />
  )
})

stories.add('with deserialized filters', () => {
  const [filterTree, setFilterTree] = useState(deserializedFilters)
  return (
    <FilterGroup
      limitDepth={number('Nesting Depth', 1)}
      {...filterTree}
      onChange={setFilterTree}
    />
  )
})

const searchFormFilter = {
  type: 'AND',
  filters: [deserializedFilters, baseFilter],
}

stories.add('as search form', () => {
  return (
    <QueryAdvanced
      filterTree={searchFormFilter}
      limitDepth={number('Nesting Depth', 1)}
      onSearch={(value: any) => {
        action('onSearch')(value)
      }}
      editing={false}
    />
  )
})
