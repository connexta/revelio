import { action } from '@storybook/addon-actions'
import React from 'react'
import TextSearchQueryBuilder from '.'
import { storiesOf } from '../../@storybook/react'
import useState from '../../@storybook/use-state'
const stories = storiesOf('Text Search', module)

stories.add('Basic', () => {
  const [query, setQuery] = useState()

  return (
    <TextSearchQueryBuilder
      query={query}
      onChange={query => {
        action('onChange')(query)
        setQuery(query)
      }}
    />
  )
})
