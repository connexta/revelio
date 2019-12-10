const { storiesOf } = require('../@storybook/react')
import * as React from 'react'
import { action } from '@storybook/addon-actions'
import { number } from '@storybook/addon-knobs'
import { useState } from 'react'
import Filter from './filter'

const stories = storiesOf('Query Filters', module)

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

stories.add('basic', () => {
  const [filter, setFilter]: any = useState(baseFilterGroup)

  return (
    <Filter
      limitDepth={number('Nesting Depth', 1)}
      {...filter}
      onChange={(value: any) => {
        setFilter(value)
        action('onChange')(value)
      }}
    />
  )
})

stories.add('with deserialized filters', () => {
  const [filter, setFilter]: any = useState(deserializedFilters)
  return (
    <Filter
      limitDepth={number('Nesting Depth', 1)}
      {...filter}
      onChange={(value: any) => {
        setFilter(value)
        action('onChange')(value)
      }}
    />
  )
})

const searchFormFilter = {
  type: 'AND',
  filters: [deserializedFilters, baseFilter],
}

stories.add('as search form', () => {
  const [filter, setFilter]: any = useState(searchFormFilter)
  return (
    <Filter
      {...filter}
      limitDepth={number('Nesting Depth', 1)}
      onChange={(value: any) => {
        setFilter(value)
        action('onChange')(value)
      }}
      editing={false}
    />
  )
})

stories.add('single filter', () => {
  const [filter, setFilter]: any = useState(nearFilter)
  return (
    <Filter
      {...filter}
      onChange={(value: any) => {
        setFilter(value)
        action('onChange')(value)
      }}
    />
  )
})
