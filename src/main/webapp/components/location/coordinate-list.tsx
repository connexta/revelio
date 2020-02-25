import * as React from 'react'
import { LengthUnit } from 'geospatialdraw/bin/geometry/units'
import { CoordinateUnit } from 'geospatialdraw/bin/coordinates/units'
import useCoordinateList from 'geospatialdraw/bin/coordinates/react-hooks/coordinate-list'
import Box from '@material-ui/core/Box'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import RemoveIcon from '@material-ui/icons/Remove'
import AddIcon from '@material-ui/icons/Add'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Point from './point'
import Length from './length'
import { SpacedLinearContainer } from '../containers'
import CoordinateValue from './coordinate-value'

type Props = {
  coordinateList: [number, number][]
  coordinateUnit: CoordinateUnit
  buffer: number
  bufferUnit: LengthUnit
  onChange: (
    coordinateList: [number, number][],
    buffer: number,
    bufferUnit: LengthUnit
  ) => void
}

const CoordinateList: React.SFC<Props> = ({
  coordinateList: initCoordinates,
  coordinateUnit,
  buffer,
  bufferUnit,
  onChange,
}) => {
  const {
    lat,
    lon,
    coordinateList,
    setSelectedIndex,
    selectedIndex,
    addCoordinateAfter,
    deleteCoordinate,
    setCoordinate,
  } = useCoordinateList(initCoordinates, 0)
  React.useEffect(
    () => {
      if (JSON.stringify(coordinateList) !== JSON.stringify(initCoordinates)) {
        onChange(coordinateList, buffer, bufferUnit)
      }
    },
    [coordinateList]
  )
  return (
    <SpacedLinearContainer direction="column" spacing={1}>
      <Point
        value={{ lat, lon }}
        coordinateUnit={coordinateUnit}
        onChange={setCoordinate}
      />
      <Length
        label="Buffer"
        value={{ length: buffer, unit: bufferUnit }}
        onChange={({ length, unit }) => onChange(coordinateList, length, unit)}
      />
      <Box>
        <Box flexDirection="row" display="flex" justifyContent="flex-end">
          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              onClick={addCoordinateAfter}
              title="Add Coordinate"
              startIcon={<AddIcon />}
            >
              Add
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={deleteCoordinate}
              title="Remove Coordinate"
              startIcon={<RemoveIcon />}
            >
              Remove
            </Button>
          </ButtonGroup>
        </Box>
        <List>
          {coordinateList.map(
            ([coordinateLon, coordinateLat], index: number) => (
              <ListItem
                key={index}
                button
                selected={index === selectedIndex}
                onClick={() => setSelectedIndex(index)}
                title={`Select Coordinate #${index + 1}`}
              >
                <CoordinateValue
                  lat={coordinateLat}
                  lon={coordinateLon}
                  unit={coordinateUnit}
                />
              </ListItem>
            )
          )}
        </List>
      </Box>
    </SpacedLinearContainer>
  )
}

export default CoordinateList
