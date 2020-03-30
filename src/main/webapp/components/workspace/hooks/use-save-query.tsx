import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { QueryType } from '../../query-builder/types'

export default () => {
  const mutation = gql`
    mutation SaveQuery($id: ID!, $attrs: MetacardAttributesInput!) {
      saveMetacard(id: $id, attributes: $attrs) {
        id
      }
    }
  `

  const [save] = useMutation(mutation)
  return (query: QueryType) => {
    save({
      variables: {
        id: query.id,
        attrs: {
          ...query,
          metacard_type: 'metacard.query',
        },
      },
    })
  }
}
