import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { useApolloFallback } from '../react-hooks'
import Sharing from './sharing'
import { useMutation } from '@apollo/react-hooks'
import LinearProgress from '@material-ui/core/LinearProgress'

const fragment = gql`
  fragment SharingAttributes on MetacardAttributes {
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
  query Sharing($ids: [ID]!) {
    metacardsById(ids: $ids) {
      attributes {
        ...SharingAttributes
      }
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
    variables: { ids: [id] },
  })

  if (loading) {
    return <LinearProgress />
  }
  if (error) {
    return <div>Error</div>
  }
  const [sharingAttributes] = data.metacardsById[0].attributes
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
