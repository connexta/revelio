import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
export const pollInterval = gql`
  query SourcePollInterval {
    systemProperties {
      sourcePollInterval
    }
  }
`
export const useSourcePollInterval = init => {
  const { data, loading, error } = useQuery(pollInterval)

  if (loading || error) {
    return init
  }

  return data.systemProperties.sourcePollInterval
}
