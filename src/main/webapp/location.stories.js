import Polygon from './polygon'
import PointRadius from './point-radius'
import Location from './location'
import React from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { text, select } from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'
import { Map } from 'immutable'
import { validate as validatePolygon } from './polygon'
import { validate as validatePointRadius } from './point-radius'
import { validate } from './location'

const stories = storiesOf('Location', module)
stories.addDecorator(Story => <Story />)

const polygonState = Map({
  coordinates: [
    [
      [-108.721313, 37.124358],
      [-99.349993, 37.124358],
      [-99.349993, 31.105568],
      [-108.721313, 31.105568],
      [-108.721313, 37.124358],
    ],
  ],
  bufferWidth: -1,
  unit: 'meters',
})

stories.add('invalid polygon', () => {
  const [state, setState] = React.useState(polygonState)
  React.useEffect(() => action('validate')(validatePolygon(state)), [state])
  return (
    <Polygon
      value={state}
      onChange={newState => {
        setState(newState)
        action('onChange')(newState)
      }}
      errors={validatePolygon(state)}
    />
  )
})

const pointRadiusState = Map({
  lat: 91,
  lon: -23.888006,
  bufferWidth: 432.410439,
  unit: 'miles',
})

stories.add('invalid point-radius', () => {
  const [state, setState] = React.useState(pointRadiusState)
  React.useEffect(() => action('validate')(validatePointRadius(state)), [state])
  return (
    <PointRadius
      value={state}
      onChange={newState => {
        setState(newState)
        action('onChange')(newState)
      }}
      errors={validatePointRadius(state)}
    />
  )
})

stories.add('basic', () => {
  const [state, setState] = React.useState(
    Map({
      type: 'line',
    })
  )
  React.useEffect(() => action('validate')(validate(state)), [state])
  return (
    <Location
      value={state}
      onChange={newState => {
        setState(newState)
        action('onChange')(newState)
      }}
      errors={validate(state)}
    />
  )
})
