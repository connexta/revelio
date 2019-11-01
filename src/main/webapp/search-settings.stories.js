import React from 'react'

import { action } from '@connexta/ace/@storybook/addon-actions'
import { storiesOf } from '@connexta/ace/@storybook/react'

import { SortOrder } from './search-settings'

const stories = storiesOf('Search Settings', module)

stories.addDecorator(Story => <Story />)

stories.add('Sort Order', () => {
  return <SortOrder setSortOrder={action('setSortOrder')} />
})
