import * as React from 'react'
import { coordinates as coordinateEditor } from 'geospatialdraw'
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

const CoordinateValue: React.SFC<coordinateEditor.CoordinateUnitProps> = ({
  lat,
  lon,
  unit,
}) => {
  const coordinates = coordinateEditor.useCoordinateUnit({ lat, lon, unit })
  return (
    <Row>
      {coordinates.map(text => (
        <Column>{text}</Column>
      ))}
    </Row>
  )
}

export default CoordinateValue
