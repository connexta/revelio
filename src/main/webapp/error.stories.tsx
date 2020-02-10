const { storiesOf } = require('./@storybook/react')
import * as React from 'react'
import ErrorMessage from './error'
import { text } from '@connexta/ace/@storybook/addon-knobs'

const stories = storiesOf('Error Message', module)

stories.add('Basic', () => {
  return (
    <ErrorMessage
      onRetry={async () =>
        new Promise(resolve => {
          setTimeout(resolve, 1000)
        })
      }
    />
  )
})

stories.add('With message', () => {
  const message = text('Message', 'Custom Error Message')
  return <ErrorMessage>{message}</ErrorMessage>
})

stories.add('With custom children', () => {
  const ListOfErrors = () => {
    return (
      <div>
        <h1>There are multiple errors: </h1>
        <li>Error 1</li>
        <li>Error 2</li>
        <li>Error 3</li>
      </div>
    )
  }
  return (
    <ErrorMessage
      onRetry={async () =>
        new Promise(resolve => {
          setTimeout(resolve, 1000)
        })
      }
    >
      <ListOfErrors />
    </ErrorMessage>
  )
})
