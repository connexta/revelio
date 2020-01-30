import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { useApolloFallback } from '../react-hooks'
import Sharing from './sharing'

const getSharingAttributes = id => {
  const getMetacardSharing = gql`
    query MetacardSharingAttributes($id: ID!, $settings: QuerySettingsInput) {
      metacardSharingAttributes(id: $id, settings: $settings) {
        individuals {
          read
          write
          admin
        }
        groups {
          read
          write
          admin
        }
      }
    }
  `
  return useQuery(getMetacardSharing, { variables: { id } })
}

const Container = props => {
  const { loading, error, data } = getSharingAttributes(props.id)
  const individuals = loading ? [] : data.metacardSharingAttributes.individuals
  const groups = loading ? [] : data.metacardSharingAttributes.groups
  return (
    <Sharing
      loading={loading}
      error={error}
      individuals={individuals}
      groups={groups}
      id={props.id}
    />
  )
}

export default props => {
  const Component = useApolloFallback(Container, Sharing)
  return <Component {...props} />
}
