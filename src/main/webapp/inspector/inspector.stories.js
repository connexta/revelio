import React from 'react'
import { storiesOf } from '../@storybook/react'
import { select, array } from '@connexta/ace/@storybook/addon-knobs'

import result from '../sample-result.json'
import results from '../sample-multi-result.json'
import Inspector from './inspector'

const stories = storiesOf('Inspector', module)

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
