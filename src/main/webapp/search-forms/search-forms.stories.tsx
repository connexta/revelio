const { storiesOf } = require('../@storybook/react')
import React from 'react'
import { boolean } from '@storybook/addon-knobs'
import { useState } from 'react'
import SearchFormRoute from './route'
import SearchFormEditor from './editor'
const { SelectionProvider } = require('../react-hooks/use-selection-interface')
const { DrawProvider } = require('../react-hooks/use-draw-interface')

const stories = storiesOf('Search Forms', module)

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
    <DrawProvider>
      <SelectionProvider>
        <SearchFormRoute
          forms={searchForms}
          onDelete={onDelete}
          loading={loading}
        />
      </SelectionProvider>
    </DrawProvider>
  )
})
stories.add('editor', () => {
  return (
    <DrawProvider>
      <SelectionProvider>
        <SearchFormEditor />
      </SelectionProvider>
    </DrawProvider>
  )
})
