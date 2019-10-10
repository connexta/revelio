import React from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { withKnobs } from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'

const stories = storiesOf('QueryStatus', module)

stories.addDecorator(withKnobs)
stories.addDecorator(Story => <Story />)

import QueryStatus from './query-status'

stories.add('one of each', () => {
  const info = {
    hits: 10,
    count: 5,
    elapsed: 100,
    id: 'ddf.distribution',
    successful: true,
  }

  const error = new Error('Network Error')

  const sources = {
    'ddf.success': { type: 'source.success', info },
    'ddf.pending': { type: 'source.pending' },
    'ddf.canceled': { type: 'source.canceled' },
    'ddf.error': { type: 'source.error', info: error },
  }

  return (
    <QueryStatus
      sources={sources}
      onRun={action('onRun')}
      onCancel={action('onCancel')}
    />
  )
})
