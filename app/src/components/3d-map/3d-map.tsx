import { Viewer } from 'cesium'
import { useEffect } from 'react'
const Map = () => {
  useEffect(() => {
    const viewer = new Viewer('cesiumContainer', {
      animation: false,
      fullscreenButton: false,
      timeline: false,
      geocoder: false,
      homeButton: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      selectionIndicator: false,
      infoBox: false,
      baseLayerPicker: false,
      imageryProvider: false,
      mapMode2D: 0,
    })
  }, [])
  return (
    <div id="cesiumContainer" style={{ height: '100%', width: '100%' }}></div>
  )
}

export default Map
