import React, { Fragment, useState } from 'react'

import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

import ResultFroms from './result-forms'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'

import Button from '@material-ui/core/Button'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import ShareIcon from '@material-ui/icons/Share'
import DeleteIcon from '@material-ui/icons/Delete'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import LinearProgress from '@material-ui/core/LinearProgress'

import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'

import moment from 'moment'

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

const ItemContainer = props => {
  const { children, style, onClick } = props

  return (
    <Fragment>
      <Card
        style={{
          width: 345,
          margin: 20,
          cursor: 'pointer',
          ...style,
        }}
        onClick={onClick}
      >
        {children}
      </Card>
    </Fragment>
  )
}

const AddItem = props => {
  const { onCreate, Editor } = props

  const [editing, setEditing] = useState(false)

  const onSave = data => {
    setEditing(false)
    onCreate(data)
  }

  const onCancel = () => {
    setEditing(false)
  }

  return (
    <Fragment>
      {editing ? (
        <Dialog open>
          <Editor onSave={onSave} onCancel={onCancel} />
        </Dialog>
      ) : null}
      <ItemContainer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => setEditing(true)}
      >
        <AddCircleOutlineIcon style={{ width: '50%', height: '50%' }} />
      </ItemContainer>
    </Fragment>
  )
}

export const ConfirmDelete = props => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { children, onDelete } = props

  return (
    <Fragment>
      {confirmDelete ? (
        <Dialog
          open
          onClick={e => e.stopPropagation()}
          onClose={() => setConfirmDelete(false)}
        >
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText>{children}</DialogContentText>
          </DialogContent>
          <DialogActions style={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setConfirmDelete(false)
              }}
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                onDelete()
                setConfirmDelete(false)
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
      <IconButton
        onClick={e => {
          e.stopPropagation()
          setConfirmDelete(true)
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Fragment>
  )
}

const Item = props => {
  const { form, Editor, onDelete } = props

  const [editing, setEditing] = useState(false)

  const onSave = data => {
    setEditing(false)
    props.onSave(data)
  }

  const onCancel = () => {
    setEditing(false)
  }

  return (
    <Fragment>
      {editing ? (
        <Dialog open>
          <Editor form={form} onSave={onSave} onCancel={onCancel} />
        </Dialog>
      ) : null}
      <ItemContainer onClick={() => setEditing(true)}>
        <CardHeader
          title={form.title}
          subheader={moment(form.modified).fromNow()}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Owner: {form.owner}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <ShareIcon />
          </IconButton>
          <ConfirmDelete onDelete={onDelete}>
            This will permanently delete the search form.
          </ConfirmDelete>
        </CardActions>
      </ItemContainer>
    </Fragment>
  )
}

const Notification = props => {
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

export const Route = props => {
  const [message, setMessage] = useState(null)

  const { loading, error, forms, Editor, onCreate, onSave, onDelete } = props

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>Error</div>
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {message ? (
        <Notification message={message} onClose={() => setMessage(null)} />
      ) : null}
      <AddItem
        Editor={Editor}
        onCreate={(...args) => {
          onCreate(...args)
          setMessage('Result Form Created')
        }}
      />
      {forms
        .concat()
        .sort((a, b) => (a.modified > b.modified ? -1 : 1))
        .map(form => {
          return (
            <Item
              key={form.id}
              Editor={Editor}
              onSave={(...args) => {
                onSave(...args)
                setMessage('Result Form Saved')
              }}
              onDelete={() => {
                onDelete(form)
                setMessage('Result Form Deleted')
              }}
              form={form}
            />
          )
        })}
    </div>
  )
}

// TODO: Add metacardOwner to fragment
//
// - When the GraphQL endpoint can return metacardOwner on save, we can
//   add metacardOwner to this fragment.
const fragment = gql`
  fragment ResultFormAttributes on MetacardAttributes {
    id
    title
    description
    modified: metacard_modified
    attributes: ui_attribute_group
  }
`

const searchForms = gql`
  query SearchForms {
    metacardsByTag(tag: "attribute-group") {
      attributes {
        ...ResultFormAttributes
        owner: metacard_owner
      }
    }
  }
  ${fragment}
`

const useCreate = () => {
  const mutation = gql`
    mutation CreateSearchForms($attrs: MetacardAttributesInput!) {
      createMetacard(attrs: $attrs) {
        ...ResultFormAttributes
        owner: metacard_owner
      }
    }
    ${fragment}
  `

  return useMutation(mutation, {
    update: (cache, { data }) => {
      const query = searchForms

      const { metacardsByTag } = cache.readQuery({ query })
      const attributes = metacardsByTag.attributes
        .filter(({ id }) => id !== data.createMetacard.id)
        .concat(data.createMetacard)

      cache.writeQuery({
        query,
        data: {
          metacardsByTag: {
            attributes,
            __typename: 'QueryResponse',
          },
        },
      })
    },
  })
}

const useSave = () => {
  const mutation = gql`
    mutation SaveSearchForms($id: ID!, $attrs: MetacardAttributesInput!) {
      saveMetacard(id: $id, attrs: $attrs) {
        ...ResultFormAttributes
      }
    }
    ${fragment}
  `
  return useMutation(mutation)
}

const useDelete = () => {
  const mutation = gql`
    mutation DeleteSearchForms($id: ID!) {
      deleteMetacard(id: $id)
    }
  `

  return useMutation(mutation, {
    update: (cache, { data }) => {
      const query = searchForms

      const { metacardsByTag } = cache.readQuery({ query })
      const attributes = metacardsByTag.attributes.filter(
        ({ id }) => id !== data.deleteMetacard
      )

      cache.writeQuery({
        query,
        data: {
          metacardsByTag: {
            attributes,
            __typename: 'QueryResponse',
          },
        },
      })
    },
  })
}

const resultFormAttributes = gql`
  query ResultFormAttributes {
    metacardTypes {
      id
    }
  }
`

export const Editor = props => {
  const { form, attributes, loading, error, onCancel, onSave } = props

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>Error</div>
  }

  return (
    <ResultFroms
      style={{
        maxHeight: '60vh',
      }}
      form={form}
      attributes={attributes}
      onCancel={onCancel}
      onSave={onSave}
    />
  )
}

const EditorWithAttributes = props => {
  const { loading, error, data } = useQuery(resultFormAttributes)

  const attributes = loading ? [] : data.metacardTypes.map(({ id }) => id)

  return (
    <Editor
      loading={loading}
      error={error}
      attributes={attributes}
      {...props}
    />
  )
}

export default () => {
  const { loading, error, data } = useQuery(searchForms)

  const [create] = useCreate()
  const [save] = useSave()
  const [_delete] = useDelete()

  if (loading) {
    return <Route loading={loading} />
  }

  if (error) {
    return <Route error={error} />
  }

  const onCreate = form => {
    const { attributes, ...rest } = form
    create({
      variables: {
        attrs: {
          ui_attribute_group: attributes,
          metacard_type: 'attribute-group',
          metacard_tags: ['VALID', 'attribute-group'],
          ...rest,
        },
      },
    })
  }

  const onSave = form => {
    const { attributes, ...rest } = form
    save({
      variables: {
        id: form.id,
        attrs: {
          ui_attribute_group: attributes,
          ...rest,
        },
      },
    })
  }

  const onDelete = form => {
    _delete({
      variables: {
        id: form.id,
      },
    })
  }

  const forms = data.metacardsByTag.attributes

  return (
    <Route
      forms={forms}
      Editor={EditorWithAttributes}
      onCreate={onCreate}
      onSave={onSave}
      onDelete={onDelete}
    />
  )
}
