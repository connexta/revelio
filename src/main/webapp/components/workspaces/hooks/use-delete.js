import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { getIn } from 'immutable'
import { workspaces } from '..'

export default () => {
  const mutation = gql`
    mutation DeleteWorkspace($id: ID!) {
      deleteMetacard(id: $id)
    }
  `

  const [_delete] = useMutation(mutation, {
    update: (cache, { data }) => {
      const query = workspaces
      const attributes = getIn(
        cache.readQuery({ query }),
        ['metacardsByTag', 'attributes'],
        []
      ).filter(({ id }) => id !== data.deleteMetacard)
      const results = getIn(
        cache.readQuery({ query }),
        ['metacardsByTag', 'results'],
        []
      ).filter(({ id }) => id !== data.deleteMetacard)

      cache.writeQuery({
        query,
        data: {
          metacardsByTag: {
            attributes,
            results,
            __typename: 'QueryResponse',
          },
        },
      })
    },
  })

  return ({ id }) => {
    _delete({
      variables: {
        id,
      },
    })
  }
}
