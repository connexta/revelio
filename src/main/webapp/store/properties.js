import api from '../api'
import { combineReducers } from 'redux'

const ns = namespace => ({
  type: name => `${namespace}/${name}`,
  reducer: fn => ({ [namespace]: fn }),
  local: state => state[namespace],
})

const { type, reducer, local } = ns('ddf.config.ui.properties')

const getBuildInfo = () => {
  const commitHash = __COMMIT_HASH__
  const isDirty = __IS_DIRTY__
  const commitDate = __COMMIT_DATE__

  return {
    commitHash,
    isDirty,
    commitDate,
    identifier: `${commitHash}${isDirty ? ' with Changes' : ''}`,
    releaseDate: commitDate,
  }
}

export const fetchProperties = () => async dispatch => {
  dispatch({
    type: type('FETCH_PROPERTIES'),
  })
  try {
    const [configProperties, configUiProperties] = await Promise.all([
      api('./internal/config'),
      api('./internal/platform/config/ui'),
    ])

    dispatch({
      type: type('SET_ATTRIBUTES'),
      attributes: {
        ...configProperties,
        ...configUiProperties,
        ...getBuildInfo(),
      },
    })
  } catch (e) {
    dispatch({ type: type('SET_ERROR'), error: e.message })
  }
}

const error = (state = null, action) => {
  switch (action.type) {
    case type('FETCH_PROPERTIES'):
      return null
    case type('SET_ERROR'):
      return action.error
    default:
      return state
  }
}

const attributes = (state = null, action) => {
  switch (action.type) {
    case type('SET_ATTRIBUTES'):
      return action.attributes
    default:
      return state
  }
}

export default reducer(combineReducers({ error, attributes }))

export const getAboutInfo = local
