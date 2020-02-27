import { action } from '@connexta/ace/@storybook/addon-actions'
import React from 'react'
import QuerySelector from '.'
import { storiesOf } from '../../@storybook/react'
import useState from '../../@storybook/use-state'
import sampleQueries from '../../sample-data/sample-queries.json'
import QueryEditor from '../query-editor'

const stories = storiesOf('Query Selector', module)

stories.add('Basic', () => {
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
