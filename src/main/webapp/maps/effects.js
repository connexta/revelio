import { useState, useEffect } from 'react'
import throttle from 'lodash.throttle'

const UPDATE_DELAY = 33

const useCursorPosition = () => {
  const [cursor, setCursorPosition] = useState({ lat: 0, lon: 0 })
  const [map, setMap] = useState(null)
  const updateCursor = throttle(setCursorPosition, UPDATE_DELAY, {
    trailing: false,
  })
  useEffect(
    () => {
      const pointerMove = e => {
        const [lon, lat] = e.coordinate
        updateCursor({ lat, lon })
      }
      if (map) {
        map.on('pointermove', pointerMove)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [map]
  )
  return { cursor, setMap }
}

export { useCursorPosition }
