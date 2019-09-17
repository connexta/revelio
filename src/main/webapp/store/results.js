import { Set } from 'immutable'

const ns = 'ddf.results.reducer'
const getLocalState = state => state[ns]

export const setSelected = selected => {
  if (typeof selected === 'string') {
    return {
      type: `${ns}/SET_SELECTED`,
      selected: Set([selected]),
    }
  } else {
    return {
      type: `${ns}/SET_SELECTED`,
      selected: Set(selected),
    }
  }
}

const selection = (state = Set(), action) => {
  switch (action.type) {
    case `${ns}/SET_SELECTED`:
      return action.selected
    default:
      return state
  }
}

export const getSelected = state => getLocalState(state).selection

export default { [ns]: selection }
