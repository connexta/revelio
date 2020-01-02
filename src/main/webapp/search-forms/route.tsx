import * as React from 'react'

import LinearProgress from '@material-ui/core/LinearProgress'
import Dialog from '@material-ui/core/Dialog'

const {
  IndexCards,
  AddCardItem,
  IndexCardItem,
  Actions,
  ShareAction,
  DeleteAction,
} = require('../index-cards')
import { useState, Fragment } from 'react'
import SearchFormEditor from './editor'
import { SearchFormType } from '.'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Box from '@material-ui/core/Box'

type SearchFormProps = SearchFormType & {
  onDelete: (form: SearchFormType) => void
  onSave: (form: SearchFormType) => void
}

const SearchForm = (props: SearchFormProps) => {
  const [editing, setEditing] = useState(false)
  const onCancel = () => setEditing(false)
  const onSave = (form: SearchFormType) => {
    setEditing(false)
    props.onSave(form)
  }
  return (
    <Fragment>
      {editing ? (
        <Dialog fullWidth maxWidth={false} open onClose={onCancel}>
          <Box height="calc(100vh - 128px)">
            <SearchFormEditor
              title={props.title}
              filterTree={props.filterTree}
              id={props.id}
              onCancel={onCancel}
              onSave={onSave}
            />
          </Box>
        </Dialog>
      ) : null}
      <IndexCardItem {...props} onClick={() => setEditing(true)}>
        <Actions>
          <ShareAction />
          <DeleteAction onDelete={props.onDelete} />
        </Actions>
      </IndexCardItem>
    </Fragment>
  )
}

type AddProps = {
  onCreate: (form: SearchFormType) => void
}

const AddSearchForm = (props: AddProps) => {
  const [editing, setEditing] = useState(false)
  const onCancel = () => setEditing(false)
  const onSave = (form: SearchFormType) => {
    setEditing(false)
    props.onCreate(form)
  }
  return (
    <Fragment>
      {editing ? (
        <Dialog fullWidth maxWidth={false} open onClose={onCancel}>
          <Box height="calc(100vh - 128px)">
            <SearchFormEditor onCancel={onCancel} onSave={onSave} />
          </Box>
        </Dialog>
      ) : null}
      <AddCardItem onClick={() => setEditing(true)} />
    </Fragment>
  )
}

type RouteProps = {
  onDelete: (form: SearchFormType) => void
  onSave: (form: SearchFormType) => void
  onCreate: (form: SearchFormType) => void
  loading?: boolean
  error?: any
  forms: SearchFormType[]
}

const Route = (props: RouteProps) => {
  const [message, setMessage] = useState<string | null>(null)

  const { loading, error, forms, onDelete, onSave, onCreate } = props
  if (loading === true) return <Loading />

  if (error) return <div>Error</div>
  return (
    <IndexCards>
      {message ? (
        <Notification message={message} onClose={() => setMessage(null)} />
      ) : null}
      <AddSearchForm
        onCreate={newForm => {
          onCreate(newForm)
          setMessage('Search Form Created')
        }}
      />
      {forms
        .slice()
        .sort((a: any, b: any) => (a.modified > b.modified ? -1 : 1))
        .map((form, i) => {
          return (
            <SearchForm
              key={i}
              title={form.title}
              id={form.id}
              owner={form.owner}
              modified={form.modified}
              filterTree={form.filterTree}
              onDelete={() => {
                onDelete(form)
                setMessage('Search Form Deleted')
              }}
              onSave={newForm => {
                onSave(newForm)
                setMessage('Search Form Saved')
              }}
            />
          )
        })}
    </IndexCards>
  )
}

type NotificationProps = {
  onClose: () => void
  message: string
  autoHideDuration?: number
}
const Notification = (props: NotificationProps) => {
  const { message, autoHideDuration = 5000, onClose } = props

  return (
    <Snackbar
      open
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <SnackbarContent message={message} />
    </Snackbar>
  )
}

const Loading = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LinearProgress style={{ width: '25vw', height: 10 }} />
    </div>
  )
}
export default Route
