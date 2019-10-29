import { storiesOf } from '@connexta/ace/@storybook/react'
import QueryAdvanced from './query-advanced'
import * as React from 'react'
import { action } from '@storybook/addon-actions'
import { withKnobs, number } from '@storybook/addon-knobs'
const stories = storiesOf('Query Advanced', module)

const baseFilter = {
  property: 'an integer',
  type: '>',
  value: 12,
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
    params: ['anyText', '2', 'hello there'],
  },
}

const rangeFilter = {
  type: 'BETWEEN',
  property: 'an integer',
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
  return (
    <QueryAdvanced
      limitDepth={number('Nesting Depth', 1)}
      {...baseFilterGroup}
      onSearch={(value: any) => {
        action('onSearch')(value)
      }}
    />
  )
})

stories.add('with deserialized filters', () => {
  return (
    <QueryAdvanced
      limitDepth={number('Nesting Depth', 1)}
      {...deserializedFilters}
      onSearch={(value: any) => {
        action('onSearch')(value)
      }}
    />
  )
})
