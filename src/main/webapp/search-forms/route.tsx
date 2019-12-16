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

type SearchForm = {
  title?: string
  id: string
  modified: string
  owner: string
  onDelete?: any
}

const SearchForm = (props: SearchForm) => {
  const [editing, setEditing] = useState(false)

  return (
    <Fragment>
      {editing ? (
        <Dialog
          fullWidth
          maxWidth={false}
          open
          onClose={() => setEditing(false)}
        >
          <SearchFormEditor
            {...props}
            onCancel={() => setEditing(false)}
            onSave={() => setEditing(false)}
          />
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

type RouteProps = {
  onDelete: (form: SearchForm) => void
  loading?: boolean
  error?: any
  forms: SearchForm[]
}

const Route = (props: RouteProps) => {
  const { loading, error, forms, onDelete } = props
  if (loading === true) return <Loading />

  if (error) return <div>Error</div>
  return (
    <IndexCards>
      <AddCardItem />
      {forms
        .slice()
        .sort((a: any, b: any) => (a.modified > b.modified ? -1 : 1))
        .map((form, i) => {
          return (
            <SearchForm key={i} {...form} onDelete={() => onDelete(form)} />
          )
        })}
    </IndexCards>
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
