import React from 'react'

import { storiesOf } from './@storybook/react'

import results from './sample-multi-result.json'
import Histogram from './histogram'

const stories = storiesOf('Histogram', module)

stories.addDecorator(Story => <Story />)

stories.add('Basic', () => {
  return <Histogram results={results} />
})
