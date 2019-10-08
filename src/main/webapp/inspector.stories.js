import React from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { action } from '@connexta/ace/@storybook/addon-actions'
import { select } from '@connexta/ace/@storybook/addon-knobs'

import result from './sampleResult.json'
import results from './sampleMultiResult.json'
import Inspector from './inspector'

const stories = storiesOf('Inspector', module)

stories.addDecorator(Story => <Story />)

stories.add('basic', () => {
  const sampleResult = select(
    'Result Set',
    {
      single: result,
      multiple: results,
    },
    result
  )
  return <Inspector results={sampleResult} />
})
