import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { useApolloFallback } from '../react-hooks'
import Sharing from './sharing'
import { useMutation } from '@apollo/react-hooks'

const getSharingAttributes = id => {
  const getMetacardSharing = gql`
    query Sharing($id: ID!, $settings: QuerySettingsInput) {
      metacardSharingAttributes(id: $id, settings: $settings) {
        individuals {
          read
          write
          admin
        }
        groups {
          read
          write
        }
      }
      user {
        roles
      }
    }
  `
  return useQuery(getMetacardSharing, { variables: { id } })
}

const fragment = gql`
  fragment SharingAttributes on MetacardAttributes {
    security_access_individuals_read
    security_access_individuals
    security_access_administrators
  }
`
const saveMetacardSharing = () => {
  const mutation = gql`
    mutation saveMetacardSharing($id: ID!, $attrs: MetacardAttributesInput!) {
      saveMetacard(id: $id, attributes: $attrs) {
        ...SharingAttributes
      }
    }
    ${fragment}
  `
  return useMutation(mutation)
}

const Container = props => {
  const { loading, error, data } = getSharingAttributes(props.id)
  const individuals = loading ? [] : data.metacardSharingAttributes.individuals
  const groups = loading ? [] : data.metacardSharingAttributes.groups
  const userRoles = loading ? [] : data.user.roles
  return (
    <Sharing
      loading={loading}
      error={error}
      individuals={individuals}
      groups={groups}
      id={props.id}
      userRoles={userRoles}
      handleClose={props.handleClose}
      save={saveMetacardSharing}
    />
  )
}

export default props => {
  const Component = useApolloFallback(Container, Sharing)
  return <Component {...props} />
}
