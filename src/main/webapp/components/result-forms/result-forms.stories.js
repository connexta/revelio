import React, { useState } from 'react'
import { storiesOf } from '../../@storybook/react'
import { number, boolean, text } from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'

const stories = storiesOf('ResultForms', module)

import { Set } from 'immutable'
import { useUndoState } from '../../react-hooks'

import TransferList from './transfer-list'
import ResultForms from './result-forms'
import { Route, Editor } from './route'

const getAttributes = total => {
  const attributes = []

  for (let i = 0; i < total; i++) {
    attributes.push(`Attribute #${i}`)
  }

  return attributes
}

stories.add('transfer list', () => {
  const props = useUndoState(Set())

  const total = number('Number of Attributes', 100)
  const required = boolean('Required', false)
  const error = boolean('Error', false)
  const label = text('Label', 'Label')
  const helperText = text('Helper Text', 'Helper text')

  const attributes = getAttributes(total)

  return (
    <div style={{ height: 'calc(100vh - 16px)' }}>
      <TransferList
        label={label}
        required={required}
        helperText={helperText}
        error={error}
        attributes={attributes}
        {...props}
      />
    </div>
  )
})

stories.add('editor', () => {
  const total = number('Number of Attributes', 100)

  const attributes = getAttributes(total)

  const resultForm = {
    title: 'Example Title',
    description: 'Example Description',
    attributes: ['id'],
  }

  const fillForm = boolean('Fill Form', false)

  return (
    <div style={{ height: 'calc(100vh - 16px)' }}>
      <ResultForms
        attributes={attributes}
        form={fillForm ? resultForm : undefined}
        onSave={action('onSave')}
        onCancel={action('onCancel')}
      />
    </div>
  )
})

const MockEditor = props => {
  const attributes = getAttributes(100)

  return <Editor attributes={attributes} {...props} />
}

stories.add('route', () => {
  const loading = boolean('Loading', false)

  const [forms, setForms] = useState([])

  const onCreate = form => {
    setForms(forms.concat(form))
  }

  const onSave = newForm => {
    const newState = forms.map(form => {
      if (form.id === newForm.id) {
        return newForm
      }
      return form
    })
    setForms(newState)
  }

  const onDelete = newForm => {
    const newState = forms.filter(form => {
      return form.id !== newForm.id
    })
    setForms(newState)
  }

  const props = {
    forms,
    loading,
    Editor: MockEditor,
    onCreate,
    onSave,
    onDelete,
  }

  return <Route {...props} />
})
