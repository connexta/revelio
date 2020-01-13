import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Menu from './draw-menu'
import { drawing } from 'geospatialdraw'

const Root = props => (
  <Box
    position="relative"
    display="flex"
    flexDirection="column"
    width="100%"
    height="100%"
    margin={0}
    padding={0}
    {...props}
  />
)
const MenuContainer = props => <Box bgcolor="rgb(52, 172, 247)" {...props} />

const withDrawMenu = WorldMap => ({
  drawGeo,
  drawShape,
  onSetShape,
  onOk,
  onCancel,
  onUpdate,
  defaultGeoProperties,
  isDrawing,
  drawStyle,
  mapStyle,
  onMapLoaded = () => {},
  ...rest
}) => {
  const [drawToolbox, setToolbox] = useState(null)
  const [map, setMap] = useState(null)
  const isActive = drawToolbox && isDrawing
  useEffect(
    () => {
      if (map && !drawToolbox) {
        setToolbox(
          new drawing.openlayers.DrawingToolbox({
            map,
            drawingStyle: drawStyle,
          })
        )
        onMapLoaded(map)
      }
    },
    [map, onMapLoaded, drawToolbox, drawStyle]
  )
  return (
    <Root>
      {drawToolbox === null ? null : (
        <MenuContainer>
          <Menu
            shape={drawShape}
            toolbox={drawToolbox}
            isActive={isActive}
            geometry={drawGeo}
            onCancel={onCancel}
            onOk={onOk}
            onSetShape={onSetShape}
            onUpdate={onUpdate}
            disabledShapes={['Point']}
            defaultGeoProperties={defaultGeoProperties}
          />
        </MenuContainer>
      )}
      <WorldMap style={mapStyle} onMapLoaded={setMap} {...rest} />
    </Root>
  )
}

export default withDrawMenu
