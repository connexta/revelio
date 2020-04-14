import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import StarIcon from '@material-ui/icons/Star'
import { ApolloError } from 'apollo-client/errors/ApolloError'
import * as React from 'react'
import { Fragment, useState } from 'react'
import {
  ConfirmDeleteMetacardInteraction,
  EditMetacardInteraction,
  MetacardInteractionsDropdown,
  ShareMetacardInteraction,
} from '../index-cards/metacard-interactions'
import { SnackbarRetry as RetryNotification } from '../network-retry'
import { defaultFilter } from '../query-builder/filter/filter-utils'
import QueryBuilder from '../query-builder/query-builder'
import { QueryType } from '../query-builder/types'
import DefaultFormInteraction from './default-form-interaction'
import SearchFormEditor from './editor'

const { Notification } = require('../notification/notification')

const {
  IndexCards,
  AddCardItem,
  IndexCardItem,
  Actions,
  ShareAction,
  DeleteAction,
  ReadOnly,
} = require('../index-cards')

type SearchFormProps = {
  onDelete: (form: QueryType) => void
  onSave: (form: QueryType) => void
  form?: QueryType
  toggleDefaultForm: () => void
  isDefault?: boolean
}

const DefaultSearchFormIndicator = () => (
  <IconButton disabled>
    <StarIcon style={{ color: '#FFBF00' }} />
  </IconButton>
)

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
      <IndexCardItem
        {...props.form}
        headerAction={props.isDefault && <DefaultSearchFormIndicator />}
        onClick={() => setEditing(true)}
      >
        <Actions attributes={form}>
          <ShareAction {...props.form} metacardType="query-template" />
          <DeleteAction itemName="search form" onDelete={props.onDelete} />
          <ReadOnly indexCardType="Search Form" />
          <MetacardInteractionsDropdown>
            <ShareMetacardInteraction
              {...props.form}
              metacardType="query-template"
            />
            <EditMetacardInteraction
              itemName="Search Form"
              onEdit={() => setEditing(true)}
            />
            <ConfirmDeleteMetacardInteraction
              itemName="Search Form"
              onDelete={props.onDelete}
            />
            <DefaultFormInteraction
              isDefault={props.isDefault}
              onToggle={props.toggleDefaultForm}
            />
          </MetacardInteractionsDropdown>
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
  error?: ApolloError
  forms: QueryType[]
  userDefaultForm?: string
  toggleDefaultForm: (id?: string) => void
  refetch?: () => void
}

const Route = (props: RouteProps) => {
  const [message, setMessage] = useState<string | null>(null)
  const { loading, error, forms, onDelete, onSave, onCreate, refetch } = props
  if (loading) return <LinearProgress />

  if (error)
    return (
      <RetryNotification
        message={'Issue retrieving search forms, would you like to retry?'}
        onRetry={refetch}
        error={error}
      />
    )

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
              isDefault={form.id === props.userDefaultForm}
              form={form}
              onDelete={() => {
                onDelete(form)
                setMessage('Search Form Deleted')
              }}
              onSave={newForm => {
                onSave(newForm)
                setMessage('Search Form Saved')
              }}
              toggleDefaultForm={() => props.toggleDefaultForm(form.id)}
            />
          )
        })}
    </IndexCards>
  )
}

export default Route
