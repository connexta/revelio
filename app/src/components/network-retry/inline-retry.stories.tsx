const { storiesOf } = require('../../@storybook/react')
import * as React from 'react'
import ErrorMessage from './inline-retry'
const stories = storiesOf('Network Retry', module)

stories.add('Inline', () => {
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

stories.add('Inline with custom children', () => {
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
