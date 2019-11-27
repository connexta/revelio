import { action } from '@connexta/ace/@storybook/addon-actions'
import { storiesOf } from '../@storybook/react'
import React, { useState } from 'react'
import PointRadius from './point-radius'
import Line from './line'
import Polygon from './polygon'
import BBox from './bbox'
import Keyword from './keyword'
import {
  shapes,
  geometry,
  coordinates as coordinateEditor,
} from 'geospatialdraw'
import withCoordinateUnitTabs from './with-coordinate-unit-tabs'
import mock from 'fetch-mock'

const stories = storiesOf('GeoLocation', module)
stories.addDecorator(Story => <Story />)

const editors = {
  pointRadius: {
    Editor: PointRadius,
    geo: geometry.makePointRadiusGeo(
      'pointRadiusGeo',
      45,
      38,
      600,
      geometry.MILES
    ),
  },
  line: {
    Editor: Line,
    geo: geometry.makeLineGeo(
      'lineGeo',
      [[50, 50], [56, 20], [36, 30]],
      50,
      geometry.KILOMETERS
    ),
  },
  polygon: {
    Editor: Polygon,
    geo: geometry.makePolygonGeo(
      'polygonGeo',
      [[50, 50], [56, 20], [36, 30]],
      30,
      geometry.NAUTICAL_MILES
    ),
  },
  bbox: {
    Editor: BBox,
    geo: geometry.makeBBoxGeo('bboxGeo', [20, 30, 50, 50]),
  },
}

const coordinateUnits = [
  coordinateEditor.LAT_LON,
  coordinateEditor.LAT_LON_DMS,
  coordinateEditor.USNG,
  coordinateEditor.UTM,
]

Object.keys(editors).forEach(key => {
  const editor = editors[key]
  coordinateUnits.forEach(coordinateUnit => {
    stories.add(`${key} using ${coordinateUnit}`, () => {
      const [geo, setGeo] = useState(editor.geo)
      return (
        <editor.Editor
          value={geo}
          onChange={update => {
            action('onChange')(update)
            setGeo(update)
          }}
          coordinateUnit={coordinateUnit}
        />
      )
    })
  })
  stories.add(`${key} with coordinate tabs`, () => {
    const [geo, setGeo] = useState(editor.geo)
    const Editor = withCoordinateUnitTabs(editor.Editor)
    return (
      <Editor
        value={geo}
        onChange={update => {
          action('onChange')(update)
          setGeo(update)
        }}
      />
    )
  })
})

const keywordSuggestions = [
  {
    id: '1dc06d71-dc20-44d5-b211-de33816071c1',
    name: 'Italy',
  },
  {
    id: 'c0ab17cc-cc60-4a15-9860-3915aa9f0afb',
    name: 'Italy Valley Cemetery',
  },
  {
    id: 'cff9dea4-2e5e-4c03-9f5b-45495c638e78',
    name: 'Italy Hill Cemetery',
  },
  {
    id: '19e138c6-03df-47ea-a657-17b5cd2932df',
    name: 'Italy Post Office',
  },
  {
    id: '9573742f-dd27-4f25-ac83-25250269f469',
    name: 'Italy Police Department',
  },
  {
    id: 'cdbcd443-c987-489e-9e01-da21e82bc9a3',
    name: 'Italy Naples Church',
  },
  {
    id: '0816671b-4ce5-45c9-a045-8f83451bcbd5',
    name: 'Italy Division',
  },
  {
    id: 'd0ef5f36-681a-4cb6-90cc-1f344e594100',
    name: 'Italy Mine',
  },
  {
    id: '07f74c89-a7b2-4bf9-87fa-22d7d21a6ef4',
    name: 'Italy Mine',
  },
  {
    id: '75b3f19c-0872-466c-ad89-c051e832362e',
    name: 'Italy Hollow Cemetery',
  },
]
const keywordResult = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-77.3811, 42.5304],
        [-77.1811, 42.5304],
        [-77.1811, 42.7304],
        [-77.3811, 42.7304],
        [-77.3811, 42.5304],
      ],
    ],
  },
  properties: {},
  id: 'Italy Valley Cemetery',
}

stories.add(`keyword`, () => {
  const [geo, setGeo] = useState(
    geometry.makeEmptyGeometry('keyword', shapes.POLYGON)
  )
  mock.get('glob:**/internal/geofeature/suggestions?q=*', keywordSuggestions, {
    overwriteRoutes: true,
  })
  mock.get('glob:**/internal/geofeature?id=*', keywordResult, {
    overwriteRoutes: true,
  })
  return (
    <Keyword
      value={geo}
      onChange={update => {
        action('onChange')(update)
        setGeo(update)
      }}
    />
  )
})
