import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useHistory } from 'react-router-dom'
import { workspaceAttributes, workspaces } from '..'

export default () => {
  const history = useHistory()
  const mutation = gql`
    mutation CreateWorkspace($attrs: MetacardAttributesInput!) {
      createMetacard(attrs: $attrs) {
        ...WorkspaceAttributes
        id: id
        metacard_owner
        modified: metacard_modified
      }
    }
    ${workspaceAttributes}
  `

  const [create] = useMutation(mutation, {
    update: (cache, { data }) => {
      const query = workspaces
      const { metacardsByTag, user } = cache.readQuery({ query })
      const updatedWorkspaces = [
        data.createMetacard,
        ...metacardsByTag.attributes,
      ]
      const updatedResults = [
        {
          id: data.createMetacard.id,
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

      history.push(`/workspaces/${data.createMetacard.id}`)
    },
  })

  return () => {
    create({
      variables: {
        attrs: {
          title: 'New Workspace',
          metacard_type: 'workspace',
          metacard_tags: ['workspace'],
        },
      },
    })
  }
}
