import { useQuery } from '@apollo/react-hooks'
import { useApolloFallback } from '.'
import gql from 'graphql-tag'
import {
  getPermissions,
  getSecurityAttributesFromMetacard,
} from '../components/sharing/sharing-utils'

type User = {
  email?: string
  roles?: string[]
}
const user = gql`
  query UserEmailAndRoles {
    user {
      email
      roles
    }
  }
`

const useGetPermissions = (user: User) => {
  return (attributes: any) => {
    const securityAttributes = getSecurityAttributesFromMetacard(attributes)
    return getPermissions(
      user.email,
      user.roles,
      securityAttributes,
      attributes.owner
    )
  }
}

const useGetPermissionsWithQuery = () => {
  const { loading, error, data } = useQuery(user)
  if (loading || error) {
    return
  }

  return useGetPermissions(data.user)
}

export default ({ user = {} }: { user: User }) => {
  return useApolloFallback(useGetPermissionsWithQuery, useGetPermissions)(user)
}
