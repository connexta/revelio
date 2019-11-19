import React, { useState } from 'react'

import { action } from '@connexta/ace/@storybook/addon-actions'
import { storiesOf } from './@storybook/react'

import SortOrder from './search-settings'

const stories = storiesOf('Search Settings', module)

stories.addDecorator(Story => <Story />)

const useSortState = (sorts = []) => {
  const [value, setState] = useState(sorts)

  const onChange = (...args) => {
    action('onChange')(...args)
    setState(...args)
  }

  return { value, onChange }
}

stories.add('Sort Order', () => {
  return <SortOrder {...useSortState()} />
})

stories.add('Sort Order with values provided', () => {
  const sorts = [
    { attribute: 'thumbnail', direction: 'ascending' },
    { attribute: 'phonetics', direction: 'descending' },
    { attribute: 'media.bit-rate', direction: 'ascending' },
    { attribute: 'location', direction: 'descending' },
  ]

  return <SortOrder {...useSortState(sorts)} />
})
