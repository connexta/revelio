import React from 'react'
import * as ol from 'openlayers'
import Box from '@material-ui/core/Box'
import { renderer, geometry } from 'geospatialdraw'

/*

props {
  projection
  style
  geos
  viewport
  coordinateType
  maxZoom
  minZoom
  zoom
  onMapLoaded
}

*/

export const geometryListToViewport = geometryList =>
  geometryList.length > 0
    ? geometry.combineExtents(geometryList.map(geometry => geometry.bbox))
    : null

class WorldMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      map: null,
      geoRenderer: null,
      lat: 0,
      lon: 0,
    }
    this.mapDivElement = null
    this.setMapDiv = element => {
      this.mapDivElement = element
    }
    this.pointerMove = e => {
      const [lon, lat] = e.coordinate
      this.setState({ lat, lon })
    }
  }

  componentDidUpdate(prevProps) {
    const { geos, viewport, containerWidth, containerHeight } = this.props
    if (this.state.geoRenderer) {
      if (geos !== prevProps.geos) {
        this.state.geoRenderer.clearGeos()
        this.state.geoRenderer.renderList(geos || [])
      }
      if (viewport && viewport !== prevProps.viewport) {
        this.state.geoRenderer.panToExtent(viewport)
      }
      if (
        containerWidth &&
        containerHeight &&
        (containerWidth !== prevProps.containerWidth ||
          containerHeight !== prevProps.containerHeight)
      ) {
        this.state.geoRenderer.resizeMap()
      }
    }
  }

  componentDidMount() {
    const map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
      ],
      target: this.mapDivElement,
      view: new ol.View({
        center: [0, 0],
        rotation: 0,
        zoom: this.props.zoom,
        minZoom: this.props.minZoom,
        maxZoom: this.props.maxZoom,
        projection: this.props.projection,
      }),
    })
    this.mapDivElement
      .querySelectorAll('.ol-overlaycontainer-stopevent, .ol-overlaycontainer')
      .forEach(el => (el.style.display = 'none'))
    map.on('pointermove', this.pointerMove)
    const geoRenderer = new renderer.Renderer(
      map,
      this.props.style,
      this.props.maxZoom
    )
    geoRenderer.clearGeos()
    geoRenderer.renderList(this.props.geos || [])
    if (this.props.viewport) {
      geoRenderer.panToExtent(this.props.viewport)
    }
    this.setState({ map, geoRenderer }, () => {
      if (this.props.onMapLoaded) {
        this.props.onMapLoaded(map)
      }
    })
  }

  componentWillUnmount() {
    if (this.state.map) {
      this.state.map.un('pointermove', this.pointerMove)
    }
  }

  render() {
    const { lat, lon } = this.state
    return (
      <Box width="100%" height="100%" bgcolor="black" position="relative">
        <Box width="100%" height="100%" ref={this.setMapDiv} className="map" />
        <Box
          position="absolute"
          left="0"
          bottom="0"
          bgcolor="black"
          color="white"
          p={1}
        >
          {Math.abs(lat).toFixed(6)}
          &deg; {lat < 0 ? 'S' : 'N'} {Math.abs(lon).toFixed(6)}
          &deg; {lon < 0 ? 'W' : 'E'}
        </Box>
      </Box>
    )
  }
}

export default WorldMap
