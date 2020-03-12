import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { workspaceAttributes, workspaces } from '..'

export default () => {
  const mutation = gql`
    mutation CloneWorkspace($id: ID!) {
      cloneMetacard(id: $id) {
        ...WorkspaceAttributes
        id: id
        owner: metacard_owner
        modified: metacard_modified
      }
    }
    ${workspaceAttributes}
  `

  const [clone] = useMutation(mutation, {
    update: (cache, { data }) => {
      const query = workspaces
      const { metacardsByTag, user } = cache.readQuery({ query })
      const updatedWorkspaces = [
        data.cloneMetacard,
        ...metacardsByTag.attributes,
      ]
      const updatedResults = [
        {
          id: data.cloneMetacard.id,
          isSubscribed: false,
          __typename: 'QueryResponse',
        },
        ...metacardsByTag.results,
      ]
      const { email, roles } = user
      cache.writeQuery({
        query,
        data: {
          metacardsByTag: {
            attributes: updatedWorkspaces,
            results: updatedResults,
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

  return ({ id }) => {
    clone({
      variables: {
        id: id,
      },
    })
  }
}
