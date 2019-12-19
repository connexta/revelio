import { action } from '@connexta/ace/@storybook/addon-actions'
import { storiesOf } from '../@storybook/react'
import { select } from '@connexta/ace/@storybook/addon-knobs'
import React, { useState, useEffect } from 'react'
import withDrawMenu from './with-draw-menu'
import WorldMap from './world-map'
import ClusterMap from './cluster-map'
import { geometry, shapes, coordinates } from 'geospatialdraw'
import { DRAWING_STYLE, RENDERER_STYLE } from './map-style'

const WorldMapWithDrawMenu = withDrawMenu(WorldMap)
WorldMapWithDrawMenu.displayName = 'WorldMapWithDrawMenu'

const ClusterMapWithDrawMenu = withDrawMenu(ClusterMap)
ClusterMapWithDrawMenu.displayName = 'ClusterMapWithDrawMenu'

const stories = storiesOf('Maps', module)

const PROJECTION = 'EPSG:4326'

const geometryCatalog = {
  none: {
    shape: shapes.POLYGON,
    geo: null,
  },
  Line: {
    shape: shapes.LINE,
    geo: geometry.makeLineGeo(
      '',
      [[50, 50], [56, 20], [36, 30]],
      0,
      geometry.METERS
    ),
  },
  Polygon: {
    shape: shapes.POLYGON,
    geo: geometry.makePolygonGeo(
      '',
      [[50, 50], [56, 20], [36, 30]],
      0,
      geometry.METERS
    ),
  },
  'Bounding Box': {
    shape: shapes.BOUNDING_BOX,
    geo: geometry.makeBBoxGeo('', [20, 30, 50, 50]),
  },
  Circle: {
    shape: shapes.POINT_RADIUS,
    geo: geometry.makePointRadiusGeo('', 50, 50, 600, geometry.MILES),
  },
  'Buffered Line': {
    shape: shapes.LINE,
    geo: geometry.makeLineGeo(
      '',
      [[50, 50], [56, 20], [36, 30]],
      250,
      geometry.KILOMETERS
    ),
  },
  'Buffered Polygon': {
    shape: shapes.POLYGON,
    geo: geometry.makePolygonGeo(
      '',
      [[50, 50], [56, 20], [36, 30]],
      150,
      geometry.NAUTICAL_MILES
    ),
  },
}

const createDrawMenuStory = (Component, additionalProps) => () => {
  const drawGeoType = select(
    'starting geometry',
    Object.keys(geometryCatalog),
    'none'
  )
  const geoData = geometryCatalog[drawGeoType]
  const [isDrawing, setIsDrawing] = useState(true)
  const [viewport, setViewport] = useState(null)
  const [geos, setGeos] = useState([])
  const [drawGeo, setDrawGeo] = useState(geoData.geo)
  const [drawShape, setDrawShape] = useState(geoData.shape)
  useEffect(
    () => {
      const update = geometryCatalog[drawGeoType]
      setDrawGeo(update.geo)
      setDrawShape(update.shape)
    },
    [drawGeoType]
  )
  return (
    <Component
      {...additionalProps}
      projection={PROJECTION}
      maxZoom={20}
      minZoom={1.5}
      zoom={2}
      geos={geos}
      viewport={viewport}
      coordinateType={coordinates.LAT_LON}
      isDrawing={isDrawing}
      mapStyle={RENDERER_STYLE}
      drawStyle={DRAWING_STYLE}
      drawShape={drawShape}
      drawGeo={drawGeo}
      onSetShape={shape => {
        setDrawShape(shape)
        setDrawGeo(null)
      }}
      onUpdate={setDrawGeo}
      onOk={() => {
        setViewport(drawGeo.bbox)
        setGeos([...geos, drawGeo])
        setIsDrawing(false)
        action('Confirmed Geo ')(drawGeo)
      }}
      onCancel={() => {
        setIsDrawing(false)
      }}
      height="500px"
    />
  )
}

stories.add('draw on WorldMap', createDrawMenuStory(WorldMapWithDrawMenu, {}))
stories.add(
  'draw on ClusterMap',
  createDrawMenuStory(ClusterMapWithDrawMenu, {
    geos: [],
    distance: 50,
    selectGeos: () => {},
  })
)
