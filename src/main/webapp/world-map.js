import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Map as OpenLayersMap, View } from 'ol'
import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Box from '@material-ui/core/Box'
import { renderer, geometry, coordinates } from 'geospatialdraw'

export const geometryListToViewport = geometryList =>
  geometryList.length > 0
    ? geometry.combineExtents(geometryList.map(geometry => geometry.bbox))
    : null

const Coordinates = ({ lat, lon, coordinateType }) =>
  coordinateType === coordinates.LAT_LON ? (
    <React.Fragment>
      {Math.abs(lat).toFixed(6)}
      &deg; {lat < 0 ? 'S' : 'N'} {Math.abs(lon).toFixed(6)}
      &deg; {lon < 0 ? 'W' : 'E'}
    </React.Fragment>
  ) : null

const WorldMap = ({
  projection,
  style,
  geos,
  viewport,
  coordinateType,
  maxZoom,
  minZoom,
  zoom,
  onMapLoaded = () => {},
  onCursorMove = () => {},
  width = '100%',
  height = '100%',
}) => {
  const mapDiv = useRef(null)
  const [mapControls, createMapControls] = useState(null)
  const [cursor, setCursorPosition] = useState({ lat: 0, lon: 0 })
  const [container, setContainer] = useState({ width: 0, height: 0 })
  useEffect(
    () => {
      const pointerMove = e => {
        const [lon, lat] = e.coordinate
        setCursorPosition({ lat, lon })
        onCursorMove(lat, lon)
      }
      if (mapDiv.current) {
        if (!mapControls) {
          const map = new OpenLayersMap({
            layers: [
              new Tile({
                source: new OSM(),
              }),
            ],
            target: mapDiv.current,
            view: new View({
              center: [0, 0],
              rotation: 0,
              zoom,
              minZoom,
              maxZoom,
              projection,
            }),
          })
          mapDiv.current
            .querySelectorAll(
              '.ol-overlaycontainer-stopevent, .ol-overlaycontainer'
            )
            .forEach(el => (el.style.display = 'none'))
          map.on('pointermove', pointerMove)
          const geoRenderer = new renderer.Renderer(map, style, maxZoom)
          createMapControls({ map, geoRenderer })
          onMapLoaded(map)
        }
      } else if (mapControls) {
        mapControls.map.un('pointermove', pointerMove)
      }
    },
    [
      mapControls,
      onCursorMove,
      zoom,
      minZoom,
      maxZoom,
      projection,
      onMapLoaded,
      style,
    ]
  )
  useEffect(
    () => {
      if (mapControls) {
        mapControls.geoRenderer.clearGeos()
        mapControls.geoRenderer.renderList(geos || [])
      }
    },
    [mapControls, geos]
  )
  useEffect(
    () => {
      if (mapControls && viewport) {
        mapControls.geoRenderer.panToExtent(viewport)
      }
    },
    [mapControls, viewport]
  )
  useEffect(() => {
    if (mapDiv.current) {
      const width = mapDiv.current.parentElement.offsetWidth
      const height = mapDiv.current.parentElement.offsetHeight
      setContainer({ width, height })
    }
  })
  useLayoutEffect(
    () => {
      if (mapControls) {
        mapControls.geoRenderer.resizeMap()
      }
    },
    [mapControls, container.width, container.height]
  )
  return (
    <Box width={width} height={height} bgcolor="black" position="relative">
      <Box width="100%" height="100%" ref={mapDiv} className="map" />
      <Box
        position="absolute"
        left="0"
        bottom="0"
        bgcolor="black"
        color="white"
        p={1}
      >
        <Coordinates coordinateType={coordinateType} {...cursor} />
      </Box>
    </Box>
  )
}

export default WorldMap
