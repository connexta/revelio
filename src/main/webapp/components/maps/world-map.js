import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  memo,
} from 'react'
import OpenLayersMap from 'ol/Map'
import View from 'ol/View'
import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Box from '@material-ui/core/Box'
import Renderer from 'geospatialdraw/bin/renderer'
import { combineExtents } from 'geospatialdraw/bin/geometry/utilities'
import { LAT_LON } from 'geospatialdraw/bin/coordinates/units'
import { useCursorPosition } from './effects'
import CoordinateValue from '../location/coordinate-value'

export const geometryListToViewport = geometryList =>
  geometryList.length > 0
    ? combineExtents(geometryList.map(geometry => geometry.bbox))
    : null

const WorldMap = ({
  projection,
  style,
  geos = [],
  center = null,
  viewport = null,
  maxZoom,
  minZoom,
  zoom,
  coordinateType = LAT_LON,
  onMapLoaded = () => {},
  width = '100%',
  height = '100%',
}) => {
  const mapDiv = useRef(null)
  const [mapControls, createMapControls] = useState(null)
  const [container, setContainer] = useState({ width: 0, height: 0 })
  const {
    cursor: { lat, lon },
    setMap,
  } = useCursorPosition()
  useEffect(
    () => {
      if (mapDiv.current && !mapControls) {
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
        const geoRenderer = new Renderer(map, style, maxZoom)
        map.once('rendercomplete', () => {
          createMapControls({ map, geoRenderer })
        })
      }
    },
    [mapDiv, mapControls, zoom, minZoom, maxZoom, projection, style]
  )
  useEffect(
    () => {
      if (mapControls) {
        setMap(mapControls.map)
        onMapLoaded(mapControls.map)
      }
    },
    [mapControls, setMap, onMapLoaded]
  )
  useEffect(
    () => {
      if (mapControls) {
        mapControls.geoRenderer.clearGeos()
        mapControls.geoRenderer.renderList(geos)
      }
    },
    [mapControls, geos]
  )
  useEffect(
    () => {
      if (mapControls) {
        if (viewport) {
          mapControls.geoRenderer.panToExtent(viewport)
        } else if (center) {
          mapControls.map.getView().setCenter(center)
        }
      }
    },
    [mapControls, viewport, center]
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (mapDiv.current) {
      const width = mapDiv.current.parentElement.offsetWidth
      const height = mapDiv.current.parentElement.offsetHeight
      if (width !== container.width || height !== container.height) {
        setContainer({ width, height })
      }
    }
  })
  useLayoutEffect(
    () => {
      if (mapControls) {
        window.requestAnimationFrame(() => {
          mapControls.geoRenderer.resizeMap()
        })
      }
    },
    [mapControls, container.width, container.height]
  )
  return (
    <Box width={width} height={height} position="relative">
      <Box width="100%" height="100%" ref={mapDiv} className="map" />
      <Box
        position="absolute"
        left="0"
        bottom="0"
        bgcolor="rgba(0,0,0, 0.5)"
        color="white"
        borderRadius="0 10px 0 0"
        p={1}
      >
        <CoordinateValue lat={lat} lon={lon} unit={coordinateType} />
      </Box>
    </Box>
  )
}

export default memo(WorldMap)
