import { useState, useCallback } from 'react'
import { Map, List, is } from 'immutable'

const useUndoState = initialState => {
  const [state, setState] = useState(() =>
    Map({
      current: 0,
      history: List([initialState]),
    })
  )

  const history = state.get('history')
  const current = state.get('current')

  const currentState = history.get(current)

  const setCurrentState = useCallback(
    nextState => {
      // prevent the same history item from being pushed to the stack twice
      if (!is(currentState, nextState)) {
        const update = state
          .update('current', current => current + 1)
          .update('history', history =>
            history.slice(0, state.get('current') + 1).push(nextState)
          )

        setState(update)
      }
    },
    [state, setState, currentState]
  )

  const canUndo = current > 0

  const onUndo = useCallback(
    () => {
      if (canUndo) {
        setState(state.update('current', i => i - 1))
      }
    },
    [state, setState, canUndo]
  )

  const canRedo = current < history.size - 1

  const onRedo = useCallback(
    () => {
      if (canRedo) {
        setState(state.update('current', i => i + 1))
      }
    },
    [state, setState, canRedo]
  )

  return {
    state: currentState,
    setState: setCurrentState,
    canUndo,
    onUndo,
    canRedo,
    onRedo,
  }
}

export default useUndoState
