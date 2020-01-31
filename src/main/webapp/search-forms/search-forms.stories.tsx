const { storiesOf } = require('../@storybook/react')
import React from 'react'
import { boolean } from '@storybook/addon-knobs'
import { useState } from 'react'
import SearchFormRoute from './route'
import { SearchFormEditor } from './editor'
import { action } from '@storybook/addon-actions'
import { defaultFilter } from '../query-builder/filter/filter-utils'
const { SelectionProvider } = require('../react-hooks/use-selection-interface')

const stories = storiesOf('Search Forms', module)

const startingForms = [
  {
    id: '1',
    title: 'Title 1',
    modified: new Date().toISOString(),
    filterTree: {
      type: 'AND',
      filters: [{ ...defaultFilter }],
    },
  },
  {
    id: '2',
    title: 'Title 2',
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

  const onSave = (form: any) => {
    setSearchForms(
      searchForms.map((searchForm: any) => {
        if (searchForm.id === form.id) {
          return { ...form, modified: new Date().toISOString() }
        }
        return searchForm
      })
    )
  }

  const onCreate = (form: any) => {
    setSearchForms(
      searchForms.concat({
        ...form,
        id: Math.random(),
        modified: new Date().toISOString(),
      })
    )
  }

  return (
    <SelectionProvider>
      <SearchFormRoute
        onCreate={onCreate}
        onSave={onSave}
        forms={searchForms}
        onDelete={onDelete}
        loading={loading}
      />
    </SelectionProvider>
  )
})
stories.add('editor', () => {
  return (
    <SelectionProvider>
      <div style={{ height: '100vh' }}>
        <SearchFormEditor
          onSearch={action('onSearch')}
          onCancel={action('onCancel')}
          onSave={action('onSave')}
        />
      </div>
    </SelectionProvider>
  )
})
