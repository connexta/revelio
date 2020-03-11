import genResults from '../../sample-data/gen-results'
import Visualizations from './visualizations'
import { SelectionProvider } from '../../react-hooks/use-selection-interface'
import React from 'react'

import { storiesOf } from '../../@storybook/react'
const stories = storiesOf('Visualizations', module)
stories.add('Basic', () => {
  const results = genResults()

  return (
    <SelectionProvider>
      <div style={{ height: '100vh' }}>
        <Visualizations results={results} />
      </div>
    </SelectionProvider>
  )
})
