import { useMutation, useQuery } from '@apollo/react-hooks'
import Dialog from '@material-ui/core/Dialog'
import LinearProgress from '@material-ui/core/LinearProgress'
import gql from 'graphql-tag'
import React, { Fragment, useState } from 'react'
import {
  Actions,
  AddCardItem,
  DeleteAction,
  IndexCardItem,
  IndexCards,
  ReadOnly,
  ShareAction,
} from '../index-cards'
import {
  ConfirmDeleteMetacardInteraction,
  EditMetacardInteraction,
  MetacardInteractionsDropdown,
  ShareMetacardInteraction,
} from '../index-cards/metacard-interactions'
import RetryComponent from '../network-retry/snackbar-retry'
import { Notification } from '../notification/notification'
import ResultForms from './result-forms'

const Loading = () => {
  return <LinearProgress />
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
      <AddCardItem onClick={() => setEditing(true)} />
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
      <IndexCardItem {...form} onClick={() => setEditing(true)}>
        <Actions attributes={form}>
          <ShareAction
            id={form.id}
            title={form.title}
            metacardType="attribute-group"
          />
          <DeleteAction itemName="result form" onDelete={onDelete} />
          <ReadOnly indexCardType="Result Form" />
          <MetacardInteractionsDropdown>
            <ShareMetacardInteraction
              id={form.id}
              title={form.title}
              metacardType="attribute-group"
            />
            <EditMetacardInteraction
              itemName="Result Form"
              onEdit={() => setEditing(true)}
            />
            <ConfirmDeleteMetacardInteraction
              itemName="Result Form"
              onDelete={onDelete}
            />
          </MetacardInteractionsDropdown>
        </Actions>
      </IndexCardItem>
    </Fragment>
  )
}

export const Route = props => {
  const [message, setMessage] = useState(null)

  const {
    loading,
    error,
    forms,
    Editor,
    onCreate,
    onSave,
    onDelete,
    refetch,
  } = props

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <RetryComponent
        message={'Issue retrieving result forms, would you like to retry?'}
        onRetry={refetch}
        error={error}
      />
    )
  }

  return (
    <IndexCards>
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
    </IndexCards>
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
    metacard_owner
    security_access_individuals_read
    security_access_individuals
    security_access_administrators
    security_access_groups_read
    security_access_groups
    attributes: ui_attribute_group
  }
`

const resultForms = gql`
  query ResultForms {
    metacardsByTag(tag: "attribute-group") {
      attributes {
        ...ResultFormAttributes
      }
    }
  }
  ${fragment}
`

const useCreate = () => {
  const mutation = gql`
    mutation CreateResultForms($attrs: MetacardAttributesInput!) {
      createMetacard(attrs: $attrs) {
        ...ResultFormAttributes
      }
    }
    ${fragment}
  `

  return useMutation(mutation, {
    update: (cache, { data }) => {
      const query = resultForms
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
    mutation SaveResultForms($id: ID!, $attrs: MetacardAttributesInput!) {
      saveMetacard(id: $id, attributes: $attrs) {
        ...ResultFormAttributes
      }
    }
    ${fragment}
  `
  return useMutation(mutation)
}

const useDelete = () => {
  const mutation = gql`
    mutation DeleteResultForms($id: ID!) {
      deleteMetacard(id: $id)
    }
  `

  return useMutation(mutation, {
    update: (cache, { data }) => {
      const query = resultForms

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
    <ResultForms
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
  const { loading, error, data, refetch } = useQuery(resultForms)

  const [create] = useCreate()
  const [save] = useSave()
  const [_delete] = useDelete()

  if (loading) {
    return <Route loading={loading} />
  }

  if (error) {
    return <Route error={error} refetch={refetch} />
  }

  const onCreate = form => {
    const { attributes, modified, ...rest } = form
    create({
      variables: {
        attrs: {
          ui_attribute_group: attributes,
          metacard_type: 'attribute-group',
          metacard_tags: ['VALID', 'attribute-group'],
          metacard_modified: modified,
          ...rest,
        },
      },
    })
  }

  const onSave = form => {
    const { attributes, modified, ...rest } = form
    save({
      variables: {
        id: form.id,
        attrs: {
          ui_attribute_group: attributes,
          metacard_modified: modified,
          metacard_type: 'attribute-group',
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
      refetch={refetch}
    />
  )
}
