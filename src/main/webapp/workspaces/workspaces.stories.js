import React from 'react'

import { storiesOf } from '@connexta/ace/@storybook/react'

import Visualizations from './visualizations'
import { SelectionProvider } from '../react-hooks/use-selection-interface'

const stories = storiesOf('Workspaces', module)

import genResults from '../gen-results'

stories.add('Visualizations', () => {
  const results = genResults()

  return (
    <SelectionProvider>
      <Visualizations results={results} />
    </SelectionProvider>
  )
})
