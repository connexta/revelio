import { action } from '@connexta/ace/@storybook/addon-actions'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { Map } from 'immutable'
import React from 'react'
import Line, { validate as validateLine } from './line'
import Location, { validate } from './location'
import PointRadius, { validate as validatePointRadius } from './point-radius'
import Polygon, { validate as validatePolygon } from './polygon'

const stories = storiesOf('Location', module)
stories.addDecorator(Story => <Story />)

const lineState = Map({
  coordinates: [[[0, 0], [1, 1], [2, 2], [3, 3]]],
  bufferWidth: -1,
  unit: 'meters',
})

stories.add('invalid line', () => {
  const [state, setState] = React.useState(lineState)
  React.useEffect(() => action('validate')(validateLine(state)), [state])
  return (
    <Line
      value={state}
      onChange={newState => {
        setState(newState)
        action('onChange')(newState)
      }}
      errors={validateLine(state)}
    />
  )
})

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
