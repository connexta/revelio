import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { getIn, setIn, fromJS } from 'immutable'
import { mergeDeepOverwriteLists } from '../utils'
const query = gql`
  query UserPreferences {
    user {
      preferences {
        alertExpiration
        alertPersistence
        columnOrder
        columnHide
        dateTimeFormat {
          datetimefmt
          timefmt
        }
        resultBlacklist {
          id
          title
        }
        resultCount
        theme {
          theme
        }
        timeZone
        querySettings {
          sourceIds
          federation
          sortPolicy {
            propertyName
            sortOrder
          }
          detail_level
          template {
            id
          }
        }
      }
    }
  }
`

const useUserPrefs = () => {
  const { data, ...restOfQuery } = useQuery(query)
  const userPrefs = getIn(data, ['user', 'preferences'], {})

  const mutation = gql`
    mutation updateUserPrefs($userPreferences: Json) {
      updateUserPreferences(userPreferences: $userPreferences)
    }
  `
  const [setUserPrefs] = useMutation(mutation, {
    update: (cache, { data }) => {
      const previousData = cache.readQuery({ query })
      const previousPreferences = getIn(
        previousData,
        ['user', 'preferences'],
        {}
      )

      const updatedData = setIn(
        previousData,
        ['user', 'preferences'],
        mergeDeepOverwriteLists(
          fromJS(previousPreferences),
          fromJS(data.updateUserPreferences)
        ).toJS()
      )
      cache.writeQuery({
        query,
        data: updatedData,
      })
    },
  })
  const onSetUserPrefs = (userPreferences: any) => {
    if (!fromJS(userPrefs).equals(fromJS(userPreferences))) {
      setUserPrefs({
        variables: { userPreferences },
        optimisticResponse: {
          updateUserPreferences: userPreferences,
        },
      })
    }
  }

  return [userPrefs, onSetUserPrefs, restOfQuery]
}
export default useUserPrefs
