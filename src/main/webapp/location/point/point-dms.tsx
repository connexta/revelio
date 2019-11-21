import * as React from 'react'
import Box from '@material-ui/core/Box'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import InputAdornment from '@material-ui/core/InputAdornment'
import Props from './props'
import { coordinates as coordinateEditor } from 'geospatialdraw'
import NumberInput from '../number'

type DMSComponentProps = {
  value: coordinateEditor.DMS
  onChange: (value: coordinateEditor.DMS) => void
  isValid: boolean
}

type DMSValueProps = DMSComponentProps & {
  maxDegrees: number
  negativeHeadingTooltip: string
  positiveHeadingTooltip: string
  negativeHeadingName: string
  positiveHeadingName: string
}

const SECONDS_PRECISION = 1

const DMSValue: React.SFC<DMSValueProps> = ({
  value,
  onChange,
  isValid,
  maxDegrees,
  negativeHeadingTooltip,
  positiveHeadingTooltip,
  negativeHeadingName,
  positiveHeadingName,
}) => {
  const display = coordinateEditor.dmsSetSign(value, 1)
  const sign = coordinateEditor.dmsSign(value)
  return (
    <React.Fragment>
      <NumberInput
        maxValue={maxDegrees}
        minValue={0}
        value={display.degree}
        decimalPlaces={0}
        label="DD"
        error={!isValid}
        helperText={isValid ? '' : 'invalid value'}
        onChange={(n: number) => {
          const degree = n * sign
          const minute = n < maxDegrees ? value.minute : 0
          const second = n < maxDegrees ? value.second : 0
          onChange({
            degree,
            minute,
            second,
          })
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">&deg;</InputAdornment>,
          style: { textAlign: 'end' }
        }}
      />
      <NumberInput
        maxValue={display.degree >= maxDegrees ? 0 : 59}
        minValue={0}
        decimalPlaces={0}
        value={display.minute}
        label="MM"
        error={!isValid}
        helperText={isValid ? '' : 'invalid value'}
        onChange={(n: number) =>
          onChange({
            ...value,
            minute: n,
          })
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">&apos;</InputAdornment>,
          style: { textAlign: 'end' },
        }}
      />
      <NumberInput
        maxValue={display.degree >= maxDegrees ? 0 : 59}
        minValue={0}
        decimalPlaces={SECONDS_PRECISION}
        value={display.second}
        label="SS"
        error={!isValid}
        helperText={isValid ? '' : 'invalid value'}
        onChange={(n: number) =>
          onChange({
            ...value,
            second: n,
          })
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">&quot;</InputAdornment>,
          style: { textAlign: 'end' },
        }}
      />
      <ToggleButtonGroup
        onChange={(_e, sign) => {
          onChange(coordinateEditor.dmsSetSign(value, sign))
        }}
      >
        <ToggleButton
          title={positiveHeadingTooltip}
          selected={sign === 1}
          value={1}
        >
          {positiveHeadingName}
        </ToggleButton>
        <ToggleButton
          title={negativeHeadingTooltip}
          selected={sign === -1}
          value={-1}
        >
          {negativeHeadingName}
        </ToggleButton>
      </ToggleButtonGroup>
    </React.Fragment>
  )
}

const DMSLatitude: React.SFC<DMSComponentProps> = props => (
  <DMSValue
    maxDegrees={90}
    negativeHeadingName="S"
    negativeHeadingTooltip="Southern Hemisphere"
    positiveHeadingName="N"
    positiveHeadingTooltip="Northern Hemisphere"
    {...props}
  />
)

const DMSLongitude: React.SFC<DMSComponentProps> = props => (
  <DMSValue
    maxDegrees={180}
    negativeHeadingName="W"
    negativeHeadingTooltip="Western Hemisphere"
    positiveHeadingName="E"
    positiveHeadingTooltip="Eastern Hemisphere"
    {...props}
  />
)

type DivProps = {
  children: React.ReactNode
}

const Root: React.SFC<DivProps> = (props: DivProps) => (
  <Box flex="flex" flexDirection="column" padding={1} {...props} />
)

const PointDMS: React.SFC<Props> = ({ value, onChange }) => {
  const [
    coordinates,
    { lat: dmsLat, lon: dmsLon },
    setDMS,
    isValid,
  ] = coordinateEditor.useDMSCoordinates(value)
  React.useEffect(
    () => {
      onChange(coordinates)
    },
    [coordinates]
  )
  return (
    <Root>
      <DMSLatitude
        isValid={isValid}
        value={dmsLat}
        onChange={dms => {
          setDMS({ lat: dms, lon: dmsLon })
        }}
      />
      <DMSLongitude
        isValid={isValid}
        value={dmsLon}
        onChange={dms => {
          setDMS({ lat: dmsLat, lon: dms })
        }}
      />
    </Root>
  )
}

export default PointDMS
