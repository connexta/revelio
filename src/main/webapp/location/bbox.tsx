import * as React from 'react'
import {
  bboxPropsToGeo,
  bboxToCoordinatePair,
  coordinatePairToBBox,
  geoToBBoxProps,
} from 'geospatialdraw/bin/coordinates/geometry/bbox'
import { UTM } from 'geospatialdraw/bin/coordinates/units'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Point from './point'
import Props from './geo-editor'
import SpacedLinearContainer from '../spaced-linear-container'

const BBox: React.SFC<Props> = ({ value, onChange, coordinateUnit }) => {
  const { id, bbox, properties } = geoToBBoxProps(value)
  const [upperLeft, lowerRight] = bboxToCoordinatePair(bbox)
  const containerDirection = coordinateUnit === UTM ? 'row' : 'column'
  const formControlStyle: any = {
    display: 'flex',
    flexDirection: containerDirection,
  }
  const formLabelStyle: any =
    coordinateUnit === UTM
      ? {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '0.5em',
        }
      : {}
  return (
    <SpacedLinearContainer direction={containerDirection} spacing={2}>
      <FormControl style={formControlStyle}>
        <FormLabel style={formLabelStyle}>Upper Left</FormLabel>
        <Point
          coordinateUnit={coordinateUnit}
          value={upperLeft}
          onChange={update =>
            onChange(
              bboxPropsToGeo({
                id,
                bbox: coordinatePairToBBox([update, lowerRight]),
                properties,
              })
            )
          }
        />
      </FormControl>
      <FormControl style={formControlStyle}>
        <FormLabel style={formLabelStyle}>Lower Right</FormLabel>
        <Point
          coordinateUnit={coordinateUnit}
          value={lowerRight}
          onChange={update =>
            onChange(
              bboxPropsToGeo({
                id,
                bbox: coordinatePairToBBox([update, upperLeft]),
                properties,
              })
            )
          }
        />
      </FormControl>
    </SpacedLinearContainer>
  )
}

export default BBox
