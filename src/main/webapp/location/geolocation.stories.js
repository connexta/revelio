import { action } from '@connexta/ace/@storybook/addon-actions'
import { storiesOf } from '../@storybook/react'
import React, { useState } from 'react'
import PointRadius from './point-radius'
import { geometry, coordinates as coordinateEditor } from 'geospatialdraw'

const stories = storiesOf('GeoLocation', module)
stories.addDecorator(Story => <Story />)

const pointRadiusGeo = geometry.makePointRadiusGeo('pointRadiusGeo', 45, 38, 600, geometry.MILES)

const coordinateUnits = [
  coordinateEditor.LAT_LON,
  coordinateEditor.LAT_LON_DMS,
  coordinateEditor.USNG,
  coordinateEditor.UTM,
]

coordinateUnits.forEach(coordinateUnit => {
  stories.add(`point radius using ${coordinateUnit}`, () => {
    const [geo, setGeo] = useState(pointRadiusGeo)
    return (
      <PointRadius
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
