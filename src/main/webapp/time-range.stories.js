import React from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { action } from '@connexta/ace/@storybook/addon-actions'
import TimeRange, { validate } from './time-range'

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
