import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { getIn } from 'immutable'

const query = gql`
  query MetacardTypes {
    metacardTypes {
      id
      type
      multivalued
    }
  }
`

//Returns metacard types in map format for easy use
/*
 * Ex. {
 *   created: {
 *     type: 'DATE',
 *     id: 'created',
 *     multivalued: true,
 *   }
 *   location: {
 *     type: 'GEOMETRY',
 *     id: 'location',
 *     multivalued: true,
 *   }
 * }
 */

export default () => {
  const { data, ...rest } = useQuery(query)
  if (getIn(data, ['metacardTypes'], undefined) === undefined) {
    return { ...rest, metacardTypes: {} }
  }
  const metacardTypes = getIn(data, ['metacardTypes'], {}).reduce(
    (types: any, type: any) => {
      types[type.id] = type
      return types
    },
    {}
  )
  return { metacardTypes, ...rest }
}
