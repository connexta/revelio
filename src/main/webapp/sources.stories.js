import React from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { Sources } from './sources'
import { withKnobs, number, select } from '@connexta/ace/@storybook/addon-knobs'

const stories = storiesOf('Sources', module)
stories.addDecorator(withKnobs)

const available = availability => {
  if (availability === 'all') {
    return true
  }
  if (availability === 'none') {
    return false
  }
  return Math.random() > 0.5
}

const generateSources = (numSources = 0, availability) => {
  const sources = []

  for (let i = 0; i < numSources; i++) {
    sources.push({
      sourceActions: [],
      available: available(availability),
      id: `ddf.distribution.${i}`,
      contentTypes: [],
      version: '',
    })
  }

  return sources
}

stories.add('Basic', () => {
  const n = number('Number of Sources', 4)
  const availability = select(
    'Source Availability',
    {
      all: 'all',
      none: 'none',
      random: 'random',
    },
    'all'
  )
  return <Sources sources={generateSources(n, availability)} />
})
