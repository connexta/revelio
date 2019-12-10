const { storiesOf } = require('../@storybook/react')
import * as React from 'react'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import { useState } from 'react'
import SearchFormRoute from './route'

const stories = storiesOf('Search Forms', module)
stories.addDecorator(withKnobs)

const startingForms = [
  {
    id: '1',
    title: 'Title',
    modified: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Title',
    modified: new Date().toISOString(),
  },
]

stories.add('route', () => {
  const [searchForms, setSearchForms]: any = useState(startingForms)
  const loading = boolean('Loading', false)
  const onDelete = (form: any) => {
    setSearchForms(
      searchForms.filter((searchForm: any) => searchForm.id !== form.id)
    )
  }
  return (
    <SearchFormRoute
      forms={searchForms}
      onDelete={onDelete}
      loading={loading}
    />
  )
})
