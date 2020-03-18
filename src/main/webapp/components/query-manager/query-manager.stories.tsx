import { action } from '@connexta/ace/@storybook/addon-actions'
import React from 'react'
import QueryManager from '.'
import { storiesOf } from '../../@storybook/react'
import useState from '../../@storybook/use-state'
import sampleQueries from '../../sample-data/sample-queries.json'
import QueryEditor from '../query-editor'
const stories = storiesOf('Query Manager', module)
import { NavigationBarContext } from '../../nav-bar-context'

import { button } from '@storybook/addon-knobs'

stories.add('Basic', () => {
  const [queries, setQueries] = useState(sampleQueries)
  const [query, setQuery] = useState(sampleQueries[0].id)
  const [navLeftRef, setNavLeftRef] = React.useState<HTMLDivElement | null>()

  const label = 'Clear Queries'
  const onClear = () => {
    setQueries([])
    setQuery('')
    return false
  }
  button(label, onClear)

  return (
    <NavigationBarContext.Provider value={navLeftRef}>
      <div ref={el => setNavLeftRef(el)} />
      <QueryManager
        queries={queries}
        currentQuery={query}
        QueryEditor={QueryEditor}
        onChange={queries => setQueries(queries)}
        onSearch={query => {
          action('onSearch')(query)
          setQuery(query.id)
        }}
      />
    </NavigationBarContext.Provider>
  )
})
