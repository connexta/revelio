import { storiesOf } from '@connexta/ace/@storybook/react'
import QueryAdvanced from './query-advanced'
import * as React from 'react'
import { useState } from 'react'
import { action } from '@storybook/addon-actions'
import { withKnobs, number } from '@storybook/addon-knobs'
const stories = storiesOf('Query Advanced', module)

const baseFilter = {
  attribute: 'anyText',
  comparator: 'Contains',
  value: '',
}

const baseFilterGroup = {
  type: 'AND',
  filters: [baseFilter],
}

stories.addDecorator(withKnobs)
stories.add('basic', () => {
  const [state, setState] = useState(baseFilterGroup)

  return (
    <QueryAdvanced
      limitDepth={number('Nesting Depth', 1)}
      {...state}
      onChange={(value: any) => {
        action('onChange')(value)
        setState(value)
      }}
    />
  )
})
