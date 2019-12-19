import React from 'react'

import { storiesOf } from '../@storybook/react'

import Visualizations from './visualizations'
import { SelectionProvider } from '../react-hooks/use-selection-interface'

const stories = storiesOf('Workspaces', module)

import genResults from '../gen-results'

stories.add('Visualizations', () => {
  const results = genResults()

  return (
    <SelectionProvider>
      <div style={{ height: `calc(100vh - 64px` }}>
        <Visualizations results={results} />
      </div>
    </SelectionProvider>
  )
})
