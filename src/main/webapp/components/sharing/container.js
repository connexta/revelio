import React from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useApolloFallback } from '../../react-hooks'
import Sharing from './sharing'
import LinearProgress from '@material-ui/core/LinearProgress'

const fragment = gql`
  fragment SharingAttributes on MetacardAttributes {
    id
    security_access_individuals_read
    security_access_individuals
    security_access_administrators
    security_access_groups_read
    security_access_groups
  }
`
const mutation = gql`
  mutation saveMetacardSharing($id: ID!, $attrs: MetacardAttributesInput!) {
    saveMetacard(id: $id, attributes: $attrs) {
      ...SharingAttributes
    }
  }
  ${fragment}
`

const getMetacardSharing = gql`
  query Sharing($id: ID!) {
    metacardById(id: $id) {
      ...SharingAttributes
    }
    user {
      roles
    }
  }
  ${fragment}
`

const Container = props => {
  const { id, metacardType } = props
  const [save] = useMutation(mutation)
  const { loading, error, data } = useQuery(getMetacardSharing, {
    variables: { id: id },
  })

  if (loading) {
    return <LinearProgress />
  }
  if (error) {
    return <div>Error</div>
  }
  console.log(data)

  const sharingAttributes = data.metacardById
  const {
    security_access_individuals_read = [],
    security_access_individuals = [],
    security_access_administrators = [],
    security_access_groups_read = [],
    security_access_groups = [],
  } = sharingAttributes
  const individuals = {
    security_access_individuals_read,
    security_access_individuals,
    security_access_administrators,
  }
  const groups = { security_access_groups_read, security_access_groups }
  const userRoles = data.user.roles
  return (
    <Sharing
      loading={loading}
      error={error}
      individuals={individuals}
      groups={groups}
      id={props.id}
      userRoles={userRoles}
      handleClose={props.handleClose}
      save={save}
      metacardType={metacardType}
    />
  )
}

export default props => {
  const Component = useApolloFallback(Container, Sharing)
  return <Component {...props} />
}
