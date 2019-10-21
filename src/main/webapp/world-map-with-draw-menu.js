import React from 'react'
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

/*
props {
  projection
  maxZoom
  minZoom
  zoom
  geos
  viewport
  coordinateType
  drawGeo
  drawShape
  isDrawing
  drawStyle
  mapStyle
  onDrawnGeo
  height
  containerWidth ?
  containerHeight ?
}
*/

class WorldMapWithDrawMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      drawToolbox: null,
      drawGeo: this.props.drawGeo,
      drawShape: this.props.drawShape,
    }
    this.setDrawShape = drawShape => {
      this.setState({ drawShape, drawGeo: null })
    }
    this.setDrawGeo = drawGeo => {
      this.setState({ drawGeo })
    }
    this.onDrawOk = () => {
      this.props.onDrawnGeo(this.state.drawGeo)
    }
    this.onDrawCancel = () => {
      this.props.onDrawnGeo(this.props.drawGeo)
    }
    this.onMapLoaded = map => {
      const drawToolbox = new drawing.openlayers.DrawingToolbox({
        map,
        drawingStyle: this.props.drawStyle,
      })
      this.setState({ drawToolbox })
    }
  }

  componentDidMount() {
    const { drawGeo, drawShape } = this.props
    this.setState({ drawGeo, drawShape })
  }

  componentDidUpdate(prevProps) {
    const { drawGeo, drawShape } = this.props
    if (prevProps.drawGeo !== drawGeo) {
      this.setState({ drawGeo })
    }
    if (prevProps.drawShape !== drawShape) {
      this.setState({ drawShape })
    }
  }

  render() {
    const { drawToolbox, drawGeo, drawShape } = this.state
    const {
      isDrawing,
      projection,
      mapStyle,
      geos,
      viewport,
      coordinateType,
      maxZoom,
      minZoom,
      zoom,
      height,
      containerWidth,
      containerHeight,
    } = this.props
    return (
      <Root>
        {drawToolbox === null ? null : (
          <MenuContainer>
            <Menu
              shape={drawShape}
              toolbox={drawToolbox}
              isActive={isDrawing}
              geometry={drawGeo}
              onCancel={this.onDrawCancel}
              onOk={this.onDrawOk}
              onSetShape={this.setDrawShape}
              onUpdate={this.setDrawGeo}
              disabledShapes={['Point']}
            />
          </MenuContainer>
        )}
        <WorldMap
          projection={projection}
          style={mapStyle}
          geos={geos}
          viewport={viewport}
          coordinateType={coordinateType}
          maxZoom={maxZoom}
          minZoom={minZoom}
          zoom={zoom}
          onMapLoaded={this.onMapLoaded}
          height={height}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
        />
      </Root>
    )
  }
}

export default WorldMapWithDrawMenu
