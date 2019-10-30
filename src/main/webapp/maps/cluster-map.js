import React, { useState, useEffect, useRef } from 'react'
import WorldMap from './world-map'

const ClusterMap = ({ onMapLoaded = () => {}, ...rest }) => {
  const initialized = useRef(false)
  const [map, setMap] = useState(null)
  useEffect(
    () => {
      const onMouseMove = () => {
        //console.log(e)
      }
      if (map && !initialized.current) {
        initialized.current = true
        map.on('mousemove', onMouseMove)
        onMapLoaded(map)
      }
      return () => {
        map.un('mousemove', onMouseMove)
      }
    },
    [map, initialized, onMapLoaded]
  )
  return <WorldMap onMapLoaded={setMap} {...rest} />
}

export default ClusterMap
