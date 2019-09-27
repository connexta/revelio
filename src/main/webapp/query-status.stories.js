import React, { useState } from 'react'
import { Set } from 'immutable'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { withKnobs, number, select } from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'

const stories = storiesOf('Query Status', module)

stories.addDecorator(withKnobs)
stories.addDecorator(Story => <Story />)

import QueryStatus from './query-status'

const Component = ({ sources }) => {
  const [selected, setSelected] = useState([])

  return (
    <QueryStatus
      sources={sources}
      selected={selected}
      onSelect={setSelected}
      onRun={action('onRun')}
      onCancel={action('onCancel')}
    />
  )
}

const status = {
  hits: 10,
  count: 5,
  elapsed: 100,
  id: 'ddf.distribution',
  successful: true,
}

stories.add('one of each', () => {
  const sources = {
    'ddf.distribution': status,
    csw: 'Pending',
    twitter: 'Canceled',
  }

  return <Component sources={sources} />
})

stories.add('all available', () => {
  const sources = {
    'ddf.distribution': status,
    csw: status,
    twitter: status,
  }

  return <Component sources={sources} />
})

stories.add('all pending', () => {
  const sources = {
    'ddf.distribution': 'Pending',
    csw: 'Pending',
    twitter: 'Pending',
  }

  return <Component sources={sources} />
})

stories.add('all canceled', () => {
  const sources = {
    'ddf.distribution': 'Canceled',
    csw: 'Canceled',
    twitter: 'Canceled',
  }

  return <Component sources={sources} />
})

stories.add('all failed', () => {
  const sources = {
    'ddf.distribution': 'Failed',
    csw: 'Failed',
    twitter: 'Failed',
  }

  return <Component sources={sources} />
})
