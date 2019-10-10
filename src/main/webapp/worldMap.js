import React from 'react'
import * as ol from 'openlayers'
import Box from '@material-ui/core/Box'
import { menu, renderer, drawing, geometry } from 'geospatialdraw'

const Root = props => (
  <Box
    display="flex"
    flexDirection="column"
    margin={0}
    padding={0}
    {...props}
  />
)
const MapContainer = Box
const MapDiv = props => (
  <Box
    width="100%"
    minheight="500px"
    {...props}
  />
)
const MenuContainer = Box
const Menu = menu.MaterialDrawMenu

class WorldMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      map: null,
      geoRenderer: null,
      drawToolbox: null,
      drawGeo: this.props.drawGeo,
      drawShape: this.props.drawShape,
      id: 'world-map-' + Math.random(),
    }
    this.setDrawShape = drawShape => {
      this.setState({ drawShape, drawGeo: null })
    }
    this.setDrawGeo = drawGeo => {
      this.setState({ drawGeo })
    }
    this.onDrawOk = () => {
      this.props.onSearchGeo(this.state.drawGeo)
    }
    this.onDrawCancel = () => {
      this.props.onSearchGeo(this.props.drawGeo)
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { drawGeo, drawShape } = this.props
    if (prevProps.drawGeo !== drawGeo) {
      this.setState({ drawGeo })
    }
    if (prevProps.drawShape !== drawShape) {
      this.setState({ drawShape })
    }
  }

  componentDidMount() {
    const map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
      ],
      target: this.state.id,
      view: new ol.View({
        center: [0, 0],
        zoom: 2,
        projection: this.props.projection,
        rotation: 0,
      }),
    })
    const geoRenderer = new renderer.Renderer(map, this.props.mapStyle, 6)
    const drawToolbox = new drawing.openlayers.DrawingToolbox({
      map,
      drawingStyle: this.props.drawStyle,
    })
    this.setState({ map, geoRenderer, drawToolbox })
  }

  render() {
    const { id, map, drawToolbox, drawGeo, drawShape } = this.state
    const isDrawing = this.props.isDrawing
    return (
      <Root>
        {map === null ? null : (
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
        <MapContainer>
          <MapDiv id={id} className="map" />
        </MapContainer>
      </Root>
    )
  }
}

export default WorldMap
