import { useState, useEffect, useRef } from 'react'

const useCursorPosition = () => {
  const initialized = useRef()
  const [cursor, setCursorPosition] = useState({ lat: 0, lon: 0 })
  const [map, setMap] = useState(null)
  useEffect(
    () => {
      const pointerMove = e => {
        const [lon, lat] = e.coordinate
        setCursorPosition({ lat, lon })
      }
      if (map && !initialized.current) {
        initialized.current = true
        map.on('pointermove', pointerMove)
      }
    },
    [cursor, map]
  )
  return { cursor, setMap }
}

export { useCursorPosition }
