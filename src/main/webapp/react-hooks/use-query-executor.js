import { useCallback, useReducer } from 'react'

import { Map } from 'immutable'

import gql from 'graphql-tag'
import { useApolloClient } from '@apollo/react-hooks'

const status = (state, action) => {
  switch (action.type) {
    case 'clear':
      return state.clear()
    case 'start':
      return state.merge(action.status)
    case 'success':
      return state.set(action.src, {
        type: 'source.success',
        info: action.status,
      })
    case 'cancel':
      return state.set(action.src, {
        type: 'source.canceled',
      })
    case 'error':
      return state.set(action.src, {
        type: 'source.error',
        info: {
          message: 'source error',
        },
      })
    default:
      return state
  }
}

const results = (state, action) => {
  switch (action.type) {
    case 'clear':
      return []
    case 'success':
      return action.results
    default:
      return state
  }
}

const reducer = (state, action) => {
  if (state.status.get(action.src, { type: '' }).type === 'source.canceled') {
    return state
  }

  return {
    status: status(state.status, action),
    results: results(state.results, action),
  }
}

const simpleSearch = gql`
  query SimpleSearch($filterTree: Json, $settings: QuerySettingsInput) {
    metacards(filterTree: $filterTree, settings: $settings) {
      results {
        actions {
          id
          url
          title
          displayName
        }
        metacard
      }
      status {
        count
        hits
        elapsed
      }
    }
  }
`

const querySettingsInputKeys = [
  'sourceIds',
  'federation',
  'phonetics',
  'sortPolicy',
  'spellcheck',
  'detail_level',
  'pageSize',
  'startIndex',
  'type',
]

const getQuerySettings = settings => {
  const filteredSettings = Object.keys(settings).reduce((acc, key) => {
    if (querySettingsInputKeys.includes(key)) {
      return { ...acc, [key]: settings[key] }
    }
    return acc
  }, {})

  return filteredSettings
}
const getSources = gql`
  query queryExecutorSources {
    sources {
      sourceId
    }
  }
`

const useQueryExecutor = () => {
  const client = useApolloClient()

  const [state, dispatch] = useReducer(reducer, {
    results: [],
    status: Map(),
  })

  const onError = useCallback(
    src => {
      dispatch({ type: 'error', src })
    },
    [dispatch]
  )

  const onClear = useCallback(
    () => {
      dispatch({ type: 'clear' })
    },
    [dispatch]
  )

  const onCancel = useCallback(
    src => {
      dispatch({ type: 'cancel', src })
    },
    [dispatch]
  )

  const onSuccess = useCallback(
    (src, data) => {
      dispatch({
        type: 'success',
        src,
        status: data.metacards.status,
        results: data.metacards.results || [],
      })
    },
    [dispatch]
  )

  const onSearch = useCallback(
    async query => {
      const { filterTree, ...settings } = query
      const querySettings = getQuerySettings(settings)
      if (!querySettings.sourceIds) {
        const { data } = await client.query({
          query: getSources,
          fetchPolicy: 'cache-first',
        })
        querySettings.sourceIds = data.sources.map(source => source.sourceId)
      }
      const { sourceIds } = querySettings
      const status = sourceIds.reduce((status, src) => {
        return status.set(src, { type: 'source.pending' })
      }, Map())

      dispatch({ type: 'start', status })

      sourceIds.map(async src => {
        try {
          const { data } = await client.query({
            query: simpleSearch,
            variables: {
              filterTree,
              settings: { ...querySettings, sourceIds: [src] },
            },
            fetchPolicy: 'network-only',
          })
          onSuccess(src, data)
        } catch (e) {
          onError(src)
        }
      })
    },
    [client, onSuccess, onError]
  )

  return {
    results: state.results,
    status: state.status.toJSON(),
    onSearch,
    onCancel,
    onClear,
  }
}

export default useQueryExecutor
