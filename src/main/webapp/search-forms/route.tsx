import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import LinearProgress from '@material-ui/core/LinearProgress'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import * as React from 'react'
import { Fragment, useState } from 'react'
import { defaultFilter } from '../query-builder/filter/filter-utils'
import QueryBuilder from '../query-builder/query-builder'
import { QueryType } from '../query-builder/types'
import SearchFormEditor from './editor'

const {
  IndexCards,
  AddCardItem,
  IndexCardItem,
  Actions,
  ShareAction,
  DeleteAction,
} = require('../index-cards')

type SearchFormProps = {
  onDelete: (form: QueryType) => void
  onSave: (form: QueryType) => void
  form?: QueryType
}

const SearchForm = (props: SearchFormProps) => {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(props.form)
  const onCancel = () => setEditing(false)
  const onSave = (form: QueryType) => {
    setEditing(false)
    props.onSave(form)
  }
  return (
    <Fragment>
      {editing ? (
        <Dialog fullWidth maxWidth={false} open onClose={onCancel}>
          <Box height="calc(100vh - 128px)">
            <SearchFormEditor
              queryBuilder={QueryBuilder}
              title={'Search Form Editor'}
              query={form}
              onChange={(form: QueryType) => setForm(form)}
              onCancel={onCancel}
              onSave={onSave}
            />
          </Box>
        </Dialog>
      ) : null}
      <IndexCardItem {...props.form} onClick={() => setEditing(true)}>
        <Actions>
          <ShareAction />
          <DeleteAction onDelete={props.onDelete} />
        </Actions>
      </IndexCardItem>
    </Fragment>
  )
}

type AddProps = {
  onCreate: (form: QueryType) => void
}

const defaultForm: QueryType = {
  filterTree: {
    type: 'AND',
    filters: [{ ...defaultFilter }],
  },
}
const AddSearchForm = (props: AddProps) => {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const onCancel = () => setEditing(false)
  const onSave = (form: QueryType) => {
    setEditing(false)
    props.onCreate(form)
    setForm(defaultForm)
  }
  return (
    <Fragment>
      {editing ? (
        <Dialog fullWidth maxWidth={false} open onClose={onCancel}>
          <Box height="calc(100vh - 128px)">
            <SearchFormEditor
              queryBuilder={QueryBuilder}
              title={'Search Form Editor'}
              query={form}
              onChange={(form: QueryType) => setForm(form)}
              onCancel={onCancel}
              onSave={onSave}
            />
          </Box>
        </Dialog>
      ) : null}
      <AddCardItem onClick={() => setEditing(true)} />
    </Fragment>
  )
}

type RouteProps = {
  onDelete: (form: QueryType) => void
  onSave: (form: QueryType) => void
  onCreate: (form: QueryType) => void
  loading?: boolean
  error?: any
  forms: QueryType[]
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
        .map(form => {
          return (
            <SearchForm
              key={form.id}
              form={form}
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
