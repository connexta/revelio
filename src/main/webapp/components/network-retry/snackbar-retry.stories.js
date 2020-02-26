import React from 'react'
import { storiesOf } from '../../@storybook/react'
import RetryNotification from './snackbar-retry'
import { text } from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'

const stories = storiesOf('Network Retry', module)
stories.add('Snackbar', () => {
  const message = text(
    'Message',
    'Issue retrieving [thing], would you like to retry?'
  )

  return <RetryNotification message={message} refetch={action('refetch')} />
})
