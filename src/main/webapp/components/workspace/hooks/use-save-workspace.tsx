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
  return (setSaving: (isSaving: boolean) => void, workspace: Workspace) => {
    setSaving(true)
    const queries = (workspace.queries || []).map((query: QueryType) => ({
      id: query.id,
    }))
    const res = save({
      variables: {
        id,
        attrs: {
          ...workspace,
          queries,
          metacard_type: 'workspace',
        },
      },
    })
    setSaving(false)
    console.log(res)
  }
}
