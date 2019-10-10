import React, { useState } from 'react'

import { Set } from 'immutable'
import { useUndoState } from '../react-hooks'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import TransferList from './transfer-list'

const validate = (form = {}) => {
  const { title, description } = form

  const attributes = Set(form.attributes)

  const errors = {}

  if (typeof title !== 'string') {
    errors.title = 'Title must be string'
  } else if (title.trim() === '') {
    errors.title = 'Title must not be empty'
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.description = 'Description must be string'
  }

  if (attributes.isEmpty()) {
    errors.attributes = 'Attributes cannot be empty'
  }

  return errors
}

export const ResultForms = props => {
  const { form = {}, attributes = [], onCancel, onSave } = props

  const { state, setState, ...rest } = useUndoState(Set(form.attributes))

  const [title, setTitle] = useState(form.title || '')
  const [description, setDescription] = useState(form.description || '')

  const errors = validate({ title, description, attributes: state })

  const [submitted, setSubmitted] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        padding: 20,
        boxSizing: 'border-box',
        ...props.style,
      }}
    >
      <TextField
        autoFocus
        required
        fullWidth
        label="Title"
        style={{ marginBottom: 20 }}
        value={title}
        error={submitted && errors.title !== undefined}
        helperText={submitted ? errors.title : undefined}
        onChange={e => setTitle(e.target.value)}
      />
      <TextField
        fullWidth
        rows={2}
        multiline
        label="Description"
        style={{ marginBottom: 30 }}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <TransferList
        state={state}
        setState={setState}
        label="Attributes"
        required
        attributes={attributes}
        error={submitted && errors.attributes !== undefined}
        helperText={submitted ? errors.attributes : undefined}
        {...rest}
      />

      <div
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}
      >
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <div style={{ width: 10, display: 'inline-block' }} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (Object.keys(errors).length === 0) {
              const resultForm = {
                id: form.id,
                title,
                description,
                attributes: state.toJSON(),
              }
              onSave(resultForm)
            } else {
              setSubmitted(true)
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default ResultForms
