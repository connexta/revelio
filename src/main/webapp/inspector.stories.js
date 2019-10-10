import React from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { action } from '@connexta/ace/@storybook/addon-actions'
import { select, array } from '@connexta/ace/@storybook/addon-knobs'

import result from './sampleResult.json'
import results from './sampleMultiResult.json'
import { Inspector } from './inspector'
import { About } from './about'

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
  const summaryAttributes = array('Summary Attributes', [
    'created',
    'modified',
    'thumbnail',
  ])
  return (
    <Inspector results={sampleResult} summaryAttributes={summaryAttributes} />
  )
})
