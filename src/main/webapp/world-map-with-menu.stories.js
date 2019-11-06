import { action } from '@connexta/ace/@storybook/addon-actions'
import { storiesOf } from './@storybook/react'
import { withKnobs, select } from '@connexta/ace/@storybook/addon-knobs'
import React, { useState } from 'react'
import WorldMapWithDrawMenu from './world-map-with-draw-menu'
import { geometry, shapes, coordinates } from 'geospatialdraw'
import { DRAWING_STYLE, RENDERER_STYLE } from './map-style'

const stories = storiesOf('WorldMap', module)
stories.addDecorator(withKnobs)

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

stories.add('draw geometry', () => {
  const [
    { isDrawing = true, geos = [], viewport = null },
    setDrawingState,
  ] = useState(true)
  const searchGeoType = select(
    'starting geometry',
    Object.keys(geometryCatalog),
    'none'
  )
  const searchGeo = geometryCatalog[searchGeoType]
  return (
    <WorldMapWithDrawMenu
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
      drawShape={searchGeo.shape}
      drawGeo={searchGeo.geo}
      onDrawnGeo={geo => {
        setDrawingState({
          isDrawing: false,
          geos: [geo],
          viewport: geo.bbox,
        })
        action('Search For Geo')(geo)
      }}
      height="500px"
    />
  )
})
