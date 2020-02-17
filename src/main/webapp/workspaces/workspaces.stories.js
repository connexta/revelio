import Box from '@material-ui/core/Box'
import React from 'react'
import { storiesOf } from '../@storybook/react'
import useState from '../@storybook/use-state'
import genResults from '../gen-results'
import AdvancedSearchQueryBuilder from '../query-builder/query-builder'
import { SelectionProvider } from '../react-hooks/use-selection-interface'
import Editor from '../search-forms/editor'
import QuerySelector from './query-selector'
import queries from './sample-queries.json'
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

const QueryEditor = props => {
  const [query, setQuery] = React.useState(props.query)
  return (
    <Box height="calc(100vh - 128px)">
      <Editor
        //TODO add option to switch between different query builders
        queryBuilder={AdvancedSearchQueryBuilder}
        query={query}
        onChange={query => setQuery(query)}
        onCancel={props.onCancel}
        //TO-DO: onSave={}
      />
    </Box>
  )
}

stories.add('Query Selector', () => {
  const [query, setQuery] = useState(queries[0])
  return (
    <SelectionProvider>
      <QuerySelector
        queries={queries}
        currentQuery={query}
        QueryEditor={QueryEditor}
        onSelect={setQuery}
      />
    </SelectionProvider>
  )
})
