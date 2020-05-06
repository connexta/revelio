import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { QueryType } from '../../query-builder/types'

export const queryAttributes = gql`
  fragment QueryAttributes on MetacardAttributes {
    title
    filterTree
    metacard_tags
    type
    sources
    sorts
    detail_level
    id
  }
`

export default (onCreate: any) => {
  const mutation = gql`
    mutation CreateQuery($attrs: MetacardAttributesInput!) {
      createMetacard(attrs: $attrs) {
        ...QueryAttributes
      }
    }
    ${queryAttributes}
  `
  const [create] = useMutation(mutation, {
    onCompleted: data => {
      onCreate(data.createMetacard)
      const { __typename, ...query } = data.createMetacard
      onCreate(query)
    },
  })

  return (query: QueryType) => {
    create({
      variables: {
        attrs: {
          ...query,
          metacard_type: 'metacard.query',
          metacard_tags: ['metacard.query'],
        },
      },
    })
  }
}
