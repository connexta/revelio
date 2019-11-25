import * as React from 'react'
import { geometry } from 'geospatialdraw'
import NumberInput, { MaterialUIInputProps } from './number'
import Units from './units'
import SpacedLinearContainer from '../spaced-linear-container'

const LENGTH_PRECISION = 3

type Measurement = {
  length: number
  unit: geometry.LengthUnit
}

type Props = MaterialUIInputProps & {
  value: Measurement
  onChange: (value: Measurement) => void
}

const Length: React.SFC<Props> = ({
  value: { length, unit },
  onChange,
  ...rest
}) => (
  <SpacedLinearContainer direction="row" spacing={1}>
    <NumberInput
      value={length}
      onChange={update => onChange({ length: update, unit })}
      decimalPlaces={LENGTH_PRECISION}
      {...rest}
      inputProps={{
        style: {
          textAlign: 'end',
        },
      }}
      style={{
        width: '7rem',
      }}
    />
    <Units
      value={unit}
      onChange={update => onChange({ length, unit: update })}
    />
  </SpacedLinearContainer>
)

export default Length
