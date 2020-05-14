import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { getIn } from 'immutable'

const query = gql`
  query MetacardTypes {
    metacardTypes {
      id
      type
      enums
    }
  }
`

export default () => {
  const { data, ...rest } = useQuery(query)
  const attributeDefinitions = getIn(data, ['metacardTypes'], [])

  return { attributeDefinitions, ...rest }
}
