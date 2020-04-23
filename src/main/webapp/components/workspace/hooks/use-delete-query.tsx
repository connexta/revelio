import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export default (onDelete: any) => {
  const mutation = gql`
    mutation DeleteQuery($id: ID!) {
      deleteMetacard(id: $id)
    }
  `

  const [_delete] = useMutation(mutation, {
    onCompleted: data => {
      onDelete(data.deleteMetacard)
    },
  })

  return (id: string) => {
    _delete({
      variables: {
        id,
      },
      optimisticResponse: { deleteMetacard: id },
    })
  }
}
