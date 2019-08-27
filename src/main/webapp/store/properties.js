import api from '../api'

export const fetchProperties = async dispatch => {
  const [configProperties, configUiProperties] = await Promise.all([
    api('./internal/config'),
    api('./internal/platform/config/ui'),
  ])
  dispatch({
    type: 'properties/SET_PROPERTIES',
    payload: { ...configProperties, ...configUiProperties },
  })
}

export default (state = null, action) => {
  switch (action.type) {
    case 'properties/SET_PROPERTIES':
      return action.payload
    default:
      return state
  }
}

export const getBranding = state => {
  if (state.properties === null) {
    return {}
  }

  const { branding, product, version } = state.properties
  return { branding, product, version }
}
