import React, { useState, useEffect, useRef } from 'react'
import Box from '@material-ui/core/Box'
import { menu, drawing } from 'geospatialdraw'
import WorldMap from './world-map'

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
const Menu = menu.MaterialDrawMenu

const usePropOveriddenState = propValue => {
  const [stateValue, setStateValue] = useState(propValue)
  const oldValue = useRef(propValue)
  useEffect(
    () => {
      if (oldValue.current !== propValue &&
        stateValue !== propValue) {
        oldValue.current = propValue
        setStateValue(propValue)
      }
    },
    [stateValue, propValue]
  )
  return [stateValue, setStateValue]
}

const WorldMapWithDrawMenu = ({
  drawGeo,
  drawShape,
  onDrawnGeo,
  defaultGeoProperties,
  isDrawing,
  drawStyle,
  onMapLoaded = () => {},
  ...rest
}) => {
  const [activeDrawGeo, setActiveDrawGeo] = usePropOveriddenState(drawGeo)
  const [activeDrawShape, setActiveDrawShape] = usePropOveriddenState(drawShape)
  const [drawToolbox, setToolbox] = useState(null)
  const [map, setMap] = useState(null)
  const setGeo = geo => {
    setActiveDrawGeo(geo)
    console.log(geo, activeDrawGeo)
  }
  useEffect(
    () => {
      if (map && !drawToolbox) {
        console.log('new toolbox')
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
  const onDrawOk = () => {
    onDrawnGeo(activeDrawGeo)
  }
  const onDrawCancel = () => {
    onDrawnGeo(drawGeo)
  }
  return (
    <Root>
      {drawToolbox === null ? null : (
        <MenuContainer>
          <Menu
            shape={activeDrawShape}
            toolbox={drawToolbox}
            isActive={isDrawing}
            geometry={activeDrawGeo}
            onCancel={onDrawCancel}
            onOk={onDrawOk}
            onSetShape={setActiveDrawShape}
            onUpdate={setGeo}
            disabledShapes={['Point']}
            defaultGeoProperties={defaultGeoProperties}
          />
        </MenuContainer>
      )}
      <WorldMap onMapLoaded={setMap} {...rest} />
    </Root>
  )
}

export default WorldMapWithDrawMenu
