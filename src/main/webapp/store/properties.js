import api from '../api'
import { combineReducers } from 'redux'

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
    type: 'properties/CLEAR',
  })
  try {
    const [configProperties, configUiProperties] = await Promise.all([
      api('./internal/config'),
      api('./internal/platform/config/ui'),
    ])

    dispatch({
      type: 'properties/SET_ATTRIBUTES',
      attributes: {
        ...configProperties,
        ...configUiProperties,
        ...getBuildInfo(),
      },
    })
  } catch (e) {
    dispatch({ type: 'properties/SET_ERROR', error: e.message })
  }
}

const error = (state = null, action) => {
  switch (action.type) {
    case 'properties/SET_ERROR':
      return action.error
    case 'properties/CLEAR':
      return null
    default:
      return state
  }
}

const attributes = (state = null, action) => {
  switch (action.type) {
    case 'properties/SET_ATTRIBUTES':
      return action.attributes
    case 'properties/CLEAR':
      return null
    default:
      return state
  }
}

export default combineReducers({ error, attributes })

export const getAboutInfo = state => state.properties
