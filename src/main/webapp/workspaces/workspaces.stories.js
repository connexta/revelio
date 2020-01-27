import React from 'react'

import { storiesOf } from '../@storybook/react'
import { action } from '@connexta/ace/@storybook/addon-actions'
import Visualizations from './visualizations'
import { SelectionProvider } from '../react-hooks/use-selection-interface'
import useState from '../@storybook/use-state'
import QuerySelector from './query-selector'
import queries from './sample-queries.json'
import { BasicSearch } from '../basic-search'

const stories = storiesOf('Workspaces', module)

import genResults from '../gen-results'

stories.add('Visualizations', () => {
  const results = genResults()

  return (
    <SelectionProvider>
      <div style={{ height: '100vh' }}>
        <Visualizations results={results} />
      </div>
    </SelectionProvider>
  )
})

const QueryEditor = ({ query }) => {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ overflow: 'hidden', padding: 2 }}>
        <BasicSearch
          query={query}
          onSearch={query => {
            action('onChange')(query)
          }}
        />
      </div>
    </div>
  )
}

stories.add('Query Selector', () => {
  const [query, setQuery] = useState(queries[0])
  return (
    <QuerySelector
      queries={queries}
      currentQuery={query}
      QueryEditor={QueryEditor}
      onSelect={setQuery}
    />
  )
})
