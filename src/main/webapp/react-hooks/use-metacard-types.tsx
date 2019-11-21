import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { getIn } from 'immutable'

const query = gql`
  query MetacardTypes {
    metacardTypes {
      id
      type
    }
  }
`

//Returns metacard types in map format for easy use
/*
 * Ex. {
 *   created: {
 *     type: 'DATE',
 *     id: 'created',
 *   }
 *   location: {
 *     type: 'GEOMETRY',
 *     id: 'location',
 *   }
 * }
 */

export default () => {
  const { data, ...rest } = useQuery(query)
  const metacardTypes = getIn(data, ['metacardTypes'], []).reduce(
    (types: any, type: any) => {
      types[type.id] = type
      return types
    },
    {}
  )

  return { metacardTypes, ...rest }
}
