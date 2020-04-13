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

const usePermissions = (user: User) => {
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

const usePermissionsWithQuery = () => {
  const { loading, error, data } = useQuery(user)
  if (loading || error) {
    return
  }

  return usePermissions(data.user)
}

export default ({ user = {} }: { user: User }) => {
  return useApolloFallback(usePermissionsWithQuery, usePermissions)(user)
}
