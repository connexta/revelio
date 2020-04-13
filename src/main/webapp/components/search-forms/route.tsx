import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import LinearProgress from '@material-ui/core/LinearProgress'
import * as React from 'react'
import { Fragment, useState } from 'react'
import { defaultFilter } from '../query-builder/filter/filter-utils'
import QueryBuilder from '../query-builder/query-builder'
import { QueryType } from '../query-builder/types'
import SearchFormEditor from './editor'
import { SnackbarRetry as RetryNotification } from '../network-retry'
import { ApolloError } from 'apollo-client/errors/ApolloError'
import IconButton from '@material-ui/core/IconButton'
import StarIcon from '@material-ui/icons/Star'

const { Notification } = require('../notification/notification')
const {
  getSecurityAttributesFromMetacard,
  getPermissions,
} = require('../sharing/sharing-utils')

const {
  IndexCards,
  AddCardItem,
  IndexCardItem,
  Actions,
  ShareAction,
  DeleteAction,
  ReadOnly,
} = require('../index-cards')
import {
  MetacardInteractionsDropdown,
  ShareMetacardInteraction,
  ConfirmDeleteMetacardInteraction,
  EditMetacardInteraction,
} from '../index-cards/metacard-interactions'

import DefaultFormInteraction from './default-form-interaction'

type SearchFormProps = {
  onDelete: (form: QueryType) => void
  onSave: (form: QueryType) => void
  form?: QueryType
  toggleDefaultForm: () => void
  isDefault?: boolean
  readOnly: boolean
  canWrite: boolean
  canShare: boolean
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
              isAdmin={props.canShare}
              metacardType="query-template"
            />
            <EditMetacardInteraction
              itemName="Search Form"
              onEdit={() => setEditing(true)}
            />
            <ConfirmDeleteMetacardInteraction
              itemName="Search Form"
              onDelete={props.onDelete}
              isWritable={props.canWrite}
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

type UserAttributes = {
  email: String
  roles: String[]
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
  userAttributes: UserAttributes
}

const Route = (props: RouteProps) => {
  const [message, setMessage] = useState<string | null>(null)
  const {
    loading,
    error,
    forms,
    onDelete,
    onSave,
    onCreate,
    refetch,
    userAttributes,
  } = props
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
          const securityAttributes = getSecurityAttributesFromMetacard(form)
          const { canShare, canWrite, readOnly } = getPermissions(
            userAttributes.email,
            userAttributes.roles,
            securityAttributes,
            form.metacard_owner
          )
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
              readOnly={readOnly}
              canWrite={canWrite}
              canShare={canShare}
            />
          )
        })}
    </IndexCards>
  )
}

export default Route
