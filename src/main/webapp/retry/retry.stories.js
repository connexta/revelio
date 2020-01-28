import React from 'react'
import { storiesOf } from '../@storybook/react'
const stories = storiesOf('Retry', module)
import RetryNotification from './retry'
import { text } from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'

stories.add('Retry', () => {
  const message = text(
    'Message',
    'Issue retrieving [thing], would you like to retry?'
  )

  return <RetryNotification message={message} refetch={action('refetch')} />
})
