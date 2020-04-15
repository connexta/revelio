import React from 'react'
import { storiesOf } from '../../@storybook/react'
const stories = storiesOf('Search Form Select', module)
import SearchFormSelect from './search-form-select'
stories.add('Basic', () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SearchFormSelect />
    </div>
  )
})
