import React, { useState } from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '../../@storybook/react'

import SortOrder from './sort-order'

const stories = storiesOf('Sort Order', module)

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
  const sortPolicy = [
    { propertyName: 'thumbnail', sortOrder: 'ascending' },
    { propertyName: 'phonetics', sortOrder: 'descending' },
    { propertyName: 'media.bit-rate', sortOrder: 'ascending' },
    { propertyName: 'location', sortOrder: 'descending' },
  ]

  return <SortOrder {...useSortState(sortPolicy)} />
})
