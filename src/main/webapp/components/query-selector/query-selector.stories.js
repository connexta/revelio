import React from 'react'

import { storiesOf } from '../../@storybook/react'
import { action } from '@connexta/ace/@storybook/addon-actions'
import useState from '../../@storybook/use-state'
import QuerySelector from '.'
import queries from '../../sample-data/sample-queries.json'
import BasicSearch from '../basic-search'

const stories = storiesOf('Query Selector', module)

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

stories.add('Basic', () => {
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
