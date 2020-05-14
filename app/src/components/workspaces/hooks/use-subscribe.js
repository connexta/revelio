import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export default () => {
  const subscribeMutation = gql`
    mutation Subscribe($id: ID!) {
      subscribeToWorkspace(id: $id)
    }
  `

  const unsubscribeMutation = gql`
    mutation Unsubscribe($id: ID!) {
      unsubscribeFromWorkspace(id: $id)
    }
  `

  const [subscribe] = useMutation(subscribeMutation)
  const [unsubscribe] = useMutation(unsubscribeMutation)

  return [subscribe, unsubscribe]
}
