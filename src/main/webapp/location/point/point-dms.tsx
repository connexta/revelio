import * as React from 'react'
import Box from '@material-ui/core/Box'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import Props from './props'
import { coordinates as coordinateEditor } from 'geospatialdraw'

type DMSComponentProps = {
  value: coordinateEditor.DMS
  onChange: (value: coordinateEditor.DMS) => void
}

type DMSValueProps = DMSComponentProps & {
  maxDegrees: number
  negativeHeadingTooltip: string
  positiveHeadingTooltip: string
  negativeHeadingName: string
  positiveHeadingName: string
}

const SECONDS_PRECISION = 1

const SMALL_INPUT_STYLE = {
  width: '3rem',
  marginRight: '0.5rem',
}

const WIDE_INPUT_STYLE = {
  width: '5rem',
  marginRight: '0.5rem',
}

const DMSValue: React.SFC<DMSValueProps> = ({
  onChange,
  maxDegrees,
  negativeHeadingTooltip,
  positiveHeadingTooltip,
  negativeHeadingName,
  positiveHeadingName,
  value,
}) => {
  const display = coordinateEditor.dmsSetSign(value, 1)
  const sign = coordinateEditor.dmsSign(value)
  return (
    <React.Fragment>
      <coordinateEditor.NumberInput
        style={SMALL_INPUT_STYLE}
        maxValue={maxDegrees}
        minValue={0}
        value={display.degree}
        decimalPlaces={0}
        placeholder="DD"
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
      />
      <coordinateEditor.NumberInput
        style={SMALL_INPUT_STYLE}
        type="text"
        maxValue={display.degree >= maxDegrees ? 0 : 59}
        minValue={0}
        decimalPlaces={0}
        value={display.minute}
        placeholder="MM"
        onChange={(n: number) =>
          onChange({
            ...value,
            minute: n,
          })
        }
      />
      <coordinateEditor.NumberInput
        style={WIDE_INPUT_STYLE}
        type="text"
        maxValue={display.degree >= maxDegrees ? 0 : 59}
        minValue={0}
        decimalPlaces={SECONDS_PRECISION}
        value={display.second}
        placeholder="SS"
        onChange={(n: number) =>
          onChange({
            ...value,
            second: n,
          })
        }
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

const Row: React.SFC<DivProps> = (props: DivProps) => (
  <Box flex="flex" flexDirection="row" padding={1} {...props} />
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
    <Row>
      <DMSLatitude
        value={dmsLat}
        onChange={dms => {
          setDMS({ lat: dms, lon: dmsLon })
        }}
      />
      <DMSLongitude
        value={dmsLon}
        onChange={dms => {
          setDMS({ lat: dmsLat, lon: dms })
        }}
      />
    </Row>
  )
}

export default PointDMS
