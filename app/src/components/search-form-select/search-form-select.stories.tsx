import React from 'react'
import { storiesOf } from '../../@storybook/react'
import { action } from '@storybook/addon-actions'
const stories = storiesOf('Search Form Select', module)
import { SearchFormSelect } from './search-form-select'
import { ApolloError } from 'apollo-client'
stories.add('Basic', () => {
  const searchForms = [
    { title: 'Search Form 1' },
    { title: 'Search Form 2' },
    { title: 'Another Search Form' },
    { title: 'Yet Another' },
  ]
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SearchFormSelect
        searchForms={searchForms}
        onSelect={action('onSelect')}
      />
    </div>
  )
})

stories.add('Loading', () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SearchFormSelect
        loading={true}
        searchForms={[]}
        onSelect={action('onSelect')}
      />
    </div>
  )
})
stories.add('Error', () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SearchFormSelect
        error={new ApolloError({})}
        searchForms={[]}
        onSelect={action('onSelect')}
      />
    </div>
  )
})
