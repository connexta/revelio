import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { QueryType } from '../../query-builder/types'
const { useParams } = require('react-router-dom')

type Workspace = {
  queries: QueryType[]
}

export default () => {
  const { id } = useParams()
  const mutation = gql`
    mutation SaveQueryToWorkspace($id: ID!, $attrs: MetacardAttributesInput!) {
      saveMetacard(id: $id, attributes: $attrs) {
        id
      }
    }
  `
  const [save] = useMutation(mutation)
  return (workspace: Workspace) => {
    const queries = (workspace.queries || []).map((query: QueryType) => ({
      id: query.id,
    }))
    save({
      variables: {
        id,
        attrs: {
          ...workspace,
          queries,
          metacard_type: 'workspace',
        },
      },
    })
  }
}
