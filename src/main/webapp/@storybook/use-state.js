import { action } from '@connexta/ace/@storybook/addon-actions'
import React from 'react'

export const useState = initialState => {
  const [state, setState] = React.useState(initialState)
  const onChange = newState => {
    setState(newState)
    action('onChange')(newState)
  }
  return [state, onChange]
}

export default useState
