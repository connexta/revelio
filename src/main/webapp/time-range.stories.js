import React from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
//import { text, select } from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'
import TimeRange from './time-range'
import { validate } from './time-range'

const stories = storiesOf('TimeRange', module)

stories.addDecorator(Story => <Story />)

stories.add('basic', () => {
  const [timeRange, setTimeRange] = React.useState({})
  return (
    <TimeRange
      timeRange={timeRange}
      setTimeRange={timeRange => {
        setTimeRange(timeRange)
        action('setTimeRange')(timeRange)
      }}
    />
  )
})

stories.add('validation', () => {
  const [timeRange, setTimeRange] = React.useState({})
  return (
    <TimeRange
      timeRange={timeRange}
      setTimeRange={timeRange => {
        setTimeRange(timeRange)
        action('setTimeRange')(timeRange)
      }}
      errors={validate(timeRange)}
    />
  )
})
