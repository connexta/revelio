import { action } from '@storybook/addon-actions'
import React from 'react'
import QueryEditor from '.'
import { storiesOf } from '../../@storybook/react'
import useState from '../../@storybook/use-state'
import sampleQueries from '../../sample-data/sample-queries.json'
import AdvancedSearchQueryBuilder from '../query-builder/query-builder'

const stories = storiesOf('Query Editor', module)

stories.add('Basic', () => {
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
