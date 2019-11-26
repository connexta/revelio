import { action } from '@connexta/ace/@storybook/addon-actions'
import { storiesOf } from '../@storybook/react'
import React, { useState } from 'react'
import PointRadius from './point-radius'
import Line from './line'
import Polygon from './polygon'
import BBox from './bbox'
import { geometry, coordinates as coordinateEditor } from 'geospatialdraw'
import withCoordinateUnitTabs from './with-coordinate-unit-tabs'

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
