import * as React from 'react'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { getIn } from 'immutable'
import SearchFormsRoute from './route'

const fragment = gql`
  fragment SearchFormAttributes on MetacardAttributes {
    id
    modified
    title
    metacard_owner
    filterTree: filter_template
  }
`
const searchForms = gql`
  query SearchForms {
    metacardsByTag(tag: "query-template") {
      attributes {
        ...SearchFormAttributes
        owner: metacard_owner
      }
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
      ).filter(({ id }: any) => id !== data.deleteMetacard)

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

export default () => {
  const { loading, error, data } = useQuery(searchForms)
  const [_delete] = useDelete()
  const onDelete = (form: any) => {
    _delete({
      variables: {
        id: form.id,
      },
    })
  }
  const forms = getIn(data, ['metacardsByTag', 'attributes'], [])

  return (
    <SearchFormsRoute
      loading={loading}
      error={error}
      onDelete={onDelete}
      forms={forms}
    />
  )
}
