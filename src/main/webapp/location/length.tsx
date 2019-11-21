import * as React from 'react'
import Box from '@material-ui/core/Box'
import { geometry } from 'geospatialdraw'
import NumberInput, { MaterialUIInputProps } from './number'
import Units from './units'

const LENGTH_PRECISION = 3

type Measurement = {
  length: number
  unit: geometry.LengthUnit
}

type Props = MaterialUIInputProps & {
  value: Measurement
  onChange: (value: Measurement) => void
}

type DivProps = {
  children: React.ReactNode
}

const Row: React.SFC<DivProps> = (props: DivProps) => (
  <Box flex="flex" flexDirection="row" padding={1} {...props} />
)

const Length: React.SFC<Props> = ({
  value: { length, unit },
  onChange,
  ...rest
}) => (
  <Row>
    <NumberInput
      value={length}
      onChange={update => onChange({ length: update, unit })}
      decimalPlaces={LENGTH_PRECISION}
      {...rest}
    />
    <Units
      value={unit}
      onChange={update => onChange({ length, unit: update })}
    />
  </Row>
)

export default Length
