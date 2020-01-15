import * as React from 'react'
import useCoordinateUnit, {
  CoordinateUnitProps,
} from 'geospatialdraw/bin/coordinates/react-hooks/coordinate-unit'
import Box from '@material-ui/core/Box'

const Row: React.SFC<any> = props => (
  <Box display="flex" margin={0} padding={0} {...props} />
)

const Column: React.SFC<any> = props => (
  <Box
    display="flex"
    flexGrow={1}
    justifyContent="flex-start"
    margin={0}
    padding={0}
    marginRight={1}
    {...props}
  />
)

const CoordinateValue: React.SFC<CoordinateUnitProps> = ({
  lat,
  lon,
  unit,
}) => {
  const coordinates = useCoordinateUnit({ lat, lon, unit })
  return (
    <Row>
      {coordinates.map((text, index) => (
        <Column key={index}>{text}</Column>
      ))}
    </Row>
  )
}

export default CoordinateValue
