import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { select } from '@storybook/addon-knobs'
import React, { useState } from 'react'
import ClusterMap from './cluster-map'
import { LAT_LON } from 'geospatialdraw/bin/coordinates/units'
import { RENDERER_STYLE as MAP_STYLE } from './map-style'

const PROJECTION = 'EPSG:4326'

const stories = storiesOf('Maps', module)

stories.add('render clusters', () => {
  const sampleGeos = [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.03166463661832, 38.9167765913355],
            [-77.03168800168329, 38.9090666585569],
            [-77.030493814687, 38.90950931436277],
            [-77.03030871898152, 38.910253467956416],
            [-77.02967391776659, 38.9104169227114],
            [-77.0288089355326, 38.91021657997259],
            [-77.02017717999789, 38.91320633500907],
            [-77.01994660099065, 38.91522213276954],
            [-77.02364702460534, 38.916798547897656],
            [-77.03166463661832, 38.9167765913355],
          ],
        ],
      },
      properties: {
        id: '',
        color: '',
        buffer: {
          width: 0,
          unit: 'meters',
        },
        shape: 'Polygon',
      },
      bbox: [
        -77.03168800168329,
        38.9090666585569,
        -77.01994660099065,
        38.916798547897656,
      ],
    },
    {
      bbox: [
        -77.03932913437343,
        38.89222719426494,
        -77.03379505212845,
        38.899925489110444,
      ],
      type: 'Feature',
      properties: {
        id: '',
        color: '',
        buffer: {
          width: 0,
          unit: 'meters',
        },
        shape: 'Bounding Box',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.03932913437343, 38.89222719426494],
            [-77.03379505212845, 38.89222719426494],
            [-77.03379505212845, 38.899925489110444],
            [-77.03932913437343, 38.899925489110444],
            [-77.03932913437343, 38.89222719426494],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.0686780957587, 38.87795245851115],
      },
      properties: {
        id: '',
        color: '',
        buffer: {
          width: 979.4785955831757,
          unit: 'meters',
        },
        shape: 'Point Radius',
      },
      bbox: [
        -77.07999321865832,
        38.86914380804275,
        -77.05736297285908,
        38.88676110897956,
      ],
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [-77.10331323286177, 38.91811619710299],
          [-77.09362950836727, 38.90675171227956],
          [-77.08294156934186, 38.90369028952271],
          [-77.07097688871643, 38.902706222907405],
          [-77.06484449945322, 38.90141039380838],
          [-77.05821689563251, 38.8995928397366],
          [-77.05577157492684, 38.89161426515309],
          [-77.05309084173344, 38.885833934204825],
          [-77.0457845712815, 38.88087012404728],
          [-77.03687495091326, 38.87431144730632],
          [-77.02813181595299, 38.85859607312668],
        ],
      },
      properties: {
        id: '',
        color: '',
        buffer: {
          width: 0,
          unit: 'meters',
        },
        shape: 'Line',
      },
      bbox: [
        -77.10331323286177,
        38.85859607312668,
        -77.02813181595299,
        38.91811619710299,
      ],
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.028019, 38.898326],
      },
      properties: {
        id: '',
        color: '',
        buffer: {
          width: 0,
          unit: 'meters',
        },
        shape: 'Point',
      },
      bbox: [-77.028019, 38.898326, -77.028019, 38.898326],
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.021717, 38.898818],
      },
      properties: {
        id: '',
        color: '',
        buffer: {
          width: 0,
          unit: 'meters',
        },
        shape: 'Point',
      },
      bbox: [-77.021717, 38.898818, -77.021717, 38.898818],
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.032099, 38.90135],
      },
      properties: {
        id: '',
        color: '',
        buffer: {
          width: 0,
          unit: 'meters',
        },
        shape: 'Point',
      },
      bbox: [-77.032099, 38.90135, -77.032099, 38.90135],
    },
  ].map((g, i) => ({
    ...g,
    properties: {
      ...g.properties,
      id: `example${i + 1}`,
    },
  }))
  const shapeIndex = select(
    'Pan To',
    ['none', ...sampleGeos.map((_x, i) => (i + 1).toString())],
    'none'
  )
  const viewport = shapeIndex === 'none' ? null : geos[shapeIndex - 1].bbox
  const [geos, setGeos] = useState(sampleGeos)
  return (
    <ClusterMap
      projection={PROJECTION}
      style={MAP_STYLE}
      geos={geos}
      viewport={viewport}
      coordinateType={LAT_LON}
      selectGeos={ids => {
        setGeos(
          geos.map(g => ({
            ...g,
            properties: {
              ...g.properties,
              selected: ids.includes(g.properties.id),
            },
          }))
        )
        action('Select Geos')(ids)
      }}
      maxZoom={20}
      minZoom={1.5}
      zoom={2}
      distance={50}
      height="500px"
    />
  )
})
