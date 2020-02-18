import { action } from '@storybook/addon-actions'
import React from 'react'
import { storiesOf } from '../@storybook/react'
import useState from '../@storybook/use-state'
import genResults from '../gen-results'
import AdvancedSearchQueryBuilder from '../query-builder/query-builder'
import { SelectionProvider } from '../react-hooks/use-selection-interface'
import QueryEditor from './query-editor'
import QuerySelector from './query-selector'
import sampleQueries from './sample-queries.json'
import Visualizations from './visualizations'

const stories = storiesOf('Workspaces', module)

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

stories.add('Query Selector', () => {
  const [queries, setQueries] = useState(sampleQueries)
  const [query, setQuery] = useState(sampleQueries[0].id)
  return (
    <QuerySelector
      queries={queries}
      currentQuery={query}
      QueryEditor={QueryEditor}
      onChange={queries => setQueries(queries)}
      onSearch={query => {
        action('onSearch')(query)
        setQuery(query.id)
      }}
    />
  )
})

stories.add('Query Editor', () => {
  const [query, setQuery] = useState(sampleQueries[0])
  return (
    <QueryEditor
      queryBuilder={AdvancedSearchQueryBuilder}
      query={query}
      onChange={query => {
        setQuery(query)
        action('onChange')(query)
      }}
      onSearch={action('onSearch')}
      onSave={action('onSave')}
    />
  )
})
