import * as React from 'react'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { getIn } from 'immutable'
import SearchFormsRoute from './route'

const fragment = gql`
  fragment SearchFormAttributes on MetacardAttributes {
    id
    title
    filterTree
    modified: metacard_modified
    metacard_owner
    sorts
    sources
    detail_level
  }
`

const searchForms = gql`
  query SearchForms {
    metacardsByTag(tag: "query-template") {
      attributes {
        security_access_administrators
        security_access_individuals
        security_access_individuals_read
        security_access_groups
        security_access_groups_read
        ...SearchFormAttributes
      }
    }
    user {
      preferences {
        querySettings {
          template {
            id
          }
        }
      }
      email
      roles
    }
  }
  ${fragment}
`

const useDelete = () => {
  const mutation = gql`
    mutation DeleteSearchForm($id: ID!) {
      deleteMetacard(id: $id)
    }
  `

  return useMutation(mutation, {
    update: (cache, { data }) => {
      const query = searchForms
      const attributes = getIn(
        cache.readQuery({ query }),
        ['metacardsByTag', 'attributes'],
        []
      ).filter(({ id }: { id: string }) => id !== data.deleteMetacard)

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
    mutation SaveSearchForm($id: ID!, $attrs: MetacardAttributesInput!) {
      saveMetacard(id: $id, attributes: $attrs) {
        ...SearchFormAttributes
      }
    }
    ${fragment}
  `
  return useMutation(mutation)
}

const securityAttributes = [
  'security_access_individuals_read',
  'security_access_individuals',
  'security_access_groups_read',
  'security_access_groups',
]

const useCreate = () => {
  const mutation = gql`
    mutation CreateSearchForm($attrs: MetacardAttributesInput!) {
      createMetacard(attrs: $attrs) {
        ...SearchFormAttributes
        security_access_administrators
      }
    }
    ${fragment}
  `
  return useMutation(mutation, {
    update: (cache, { data }) => {
      const query = searchForms

      securityAttributes.forEach(securityAttr => {
        data.createMetacard[securityAttr] = []
      })
      const attributes = getIn(
        cache.readQuery({ query }),
        ['metacardsByTag', 'attributes'],
        []
      )
        .filter(({ id }: { id: string }) => id !== data.createMetacard.id)
        .concat(data.createMetacard)

      const user = getIn(cache.readQuery({ query }), ['user'], {})
      const { email, roles } = user
      cache.writeQuery({
        query,
        data: {
          metacardsByTag: {
            attributes,
            __typename: 'QueryResponse',
          },
          user: {
            email,
            roles,
            __typename: 'User',
          },
        },
      })
    },
  })
}

export default () => {
  const { loading, error, data, refetch } = useQuery(searchForms)
  const [_delete] = useDelete()
  const onDelete = (form: any) => {
    _delete({
      variables: {
        id: form.id,
      },
    })
  }
  const [save] = useSave()
  const onSave = (form: any) => {
    const { title, filterTree, id, sources, sorts, detail_level } = form
    save({
      variables: {
        id,
        attrs: {
          title,
          filterTree,
          id,
          sources,
          sorts,
          detail_level,
          metacard_tags: ['query-template', 'VALID'],
          metacard_type: 'query-template',
        },
      },
    })
  }

  const [create] = useCreate()
  const onCreate = (form: any) => {
    const { title, filterTree, id, sources, sorts, detail_level } = form
    create({
      variables: {
        attrs: {
          title,
          filterTree,
          id,
          sources,
          sorts,
          detail_level,
          metacard_tags: ['query-template', 'VALID'],
          metacard_type: 'query-template',
        },
      },
    })
  }

  const forms = getIn(data, ['metacardsByTag', 'attributes'], [])
  const userDefaultForm = getIn(
    data,
    ['user', 'preferences', 'querySettings', 'template', 'id'],
    null
  )
  const userAttributes = getIn(data, ['user'], [])
  return (
    <SearchFormsRoute
      onCreate={onCreate}
      onSave={onSave}
      loading={loading}
      error={error}
      onDelete={onDelete}
      forms={forms}
      userDefaultForm={userDefaultForm}
      refetch={refetch}
      userAttributes={userAttributes}
    />
  )
}
