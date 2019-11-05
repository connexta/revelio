import { useState, useEffect, useRef } from 'react'
import * as _ from 'lodash'

const UPDATE_DELAY = 33

const useCursorPosition = () => {
  const initialized = useRef()
  const [cursor, setCursorPosition] = useState({ lat: 0, lon: 0 })
  const [map, setMap] = useState(null)
  const updateCursor = _.throttle(setCursorPosition, UPDATE_DELAY, {
    trailing: false,
  })
  useEffect(
    () => {
      const pointerMove = e => {
        const [lon, lat] = e.coordinate
        updateCursor({ lat, lon })
      }
      if (map && !initialized.current) {
        initialized.current = true
        map.on('pointermove', pointerMove)
      }
    },
    [cursor, map, updateCursor]
  )
  return { cursor, setMap }
}

export { useCursorPosition }
