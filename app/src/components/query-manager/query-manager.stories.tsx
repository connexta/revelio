import { action } from '@storybook/addon-actions'
import React from 'react'
import QueryManager from '.'
import { storiesOf } from '../../@storybook/react'
import useState from '../../@storybook/use-state'
import sampleQueries from '../../sample-data/sample-queries.json'
import QueryEditor from '../query-editor'
const stories = storiesOf('Query Manager', module)
import { NavigationBarContext } from '../nav-bar'

import { button } from '@storybook/addon-knobs'

stories.add('Basic', () => {
  const [queries, setQueries] = useState(sampleQueries)
  const [query, setQuery] = React.useState(sampleQueries[0].id)
  const [
    navBarLeftRef,
    setNavBarLeftRef,
  ] = React.useState<HTMLDivElement | null>()

  const label = 'Clear Queries'
  const onClear = () => {
    setQueries([])
    setQuery('')
    return false
  }
  button(label, onClear)

  return (
    <NavigationBarContext.Provider value={navBarLeftRef}>
      <div ref={el => setNavBarLeftRef(el)} />
      <QueryManager
        queryInteractions={[]}
        queries={queries}
        currentQuery={query}
        QueryEditor={QueryEditor}
        onChange={queries => {
          setQueries(queries)
        }}
        onSearch={id => {
          action('onSearch')(id)
          setQuery(id)
        }}
        onSave={id => {
          action('onSave')(id)
        }}
        onCreate={() => {
          action('onCreate')
        }}
        onDelete={id => {
          action('onDelete')(id)
        }}
      />
    </NavigationBarContext.Provider>
  )
})
