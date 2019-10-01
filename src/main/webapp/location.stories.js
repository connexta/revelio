import Polygon from './polygon'
import PointRadius from './point-radius'
import Location from './location'
import React from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { text, select } from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'
import { Map } from 'immutable'

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
  bufferWidth: 12,
  unit: 'meters',
})

stories.add('polygon', () => {
  const [state, setState] = React.useState(polygonState)
  return (
    <Polygon
      value={state}
      onChange={newState => {
        setState(newState)
        action('onChange')(newState)
      }}
    />
  )
})

const pointRadiusState = Map({
  lat: 30.767914,
  lon: -123.888006,
  bufferWidth: 432.410439,
  unit: 'miles',
})

stories.add('point-radius', () => {
  const [state, setState] = React.useState(pointRadiusState)
  return (
    <PointRadius
      state={state}
      onChange={newState => {
        setState(newState)
        action('onChange')(newState)
      }}
    />
  )
})

stories.add('basic', () => {
  const [state, setState] = React.useState(
    Map({
      type: 'polygon',
      location: polygonState,
    })
  )
  return (
    <Location
      value={state}
      onChange={newState => {
        setState(newState)
        action('onChange')(newState)
      }}
    />
  )
})
