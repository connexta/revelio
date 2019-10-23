import React from 'react'
import { Map as OpenLayersMap, View } from 'ol'
import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
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
  width ?
  height ?
}

*/

function throttled(delay, fn) {
  let lastCall = 0
  return (...args) => {
    window.requestAnimationFrame(() => {
      const now = new Date().getTime()
      if (now - lastCall >= delay) {
        lastCall = now
        fn(...args)
      }
    })
  }
}

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
      containerWidth: 0,
      containerHeight: 0,
    }
    this.mapDivElement = null
    this.setMapDiv = element => {
      this.mapDivElement = element
    }
    this.pointerMove = e => {
      const [lon, lat] = e.coordinate
      this.setState({ lat, lon })
    }
    this.mapResize = throttled(200, () => {
      if (this.state.geoRenderer) {
        this.state.geoRenderer.resizeMap()
      }
    })
  }

  componentDidUpdate(prevProps) {
    const { geos, viewport } = this.props
    if (this.state.geoRenderer) {
      if (geos !== prevProps.geos) {
        this.state.geoRenderer.clearGeos()
        this.state.geoRenderer.renderList(geos || [])
      }
      if (viewport && viewport !== prevProps.viewport) {
        this.state.geoRenderer.panToExtent(viewport)
      }
    }
    if (this.mapDivElement) {
      const containerWidth = this.mapDivElement.parentElement.offsetWidth
      const containerHeight = this.mapDivElement.parentElement.offsetHeight
      if (
        containerWidth !== this.state.containerWidth ||
        containerHeight !== this.state.containerHeight
      ) {
        this.setState({ containerWidth, containerHeight })
        this.mapResize()
      }
    }
  }

  componentDidMount() {
    const map = new OpenLayersMap({
      layers: [
        new Tile({
          source: new OSM(),
        }),
      ],
      target: this.mapDivElement,
      view: new View({
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
      <Box
        width={this.props.width || '100%'}
        height={this.props.height || '100%'}
        bgcolor="black"
        position="relative"
      >
        <Box
          width="100%"
          height="100%"
          ref={this.setMapDiv}
          className="map resize-listener"
        />
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
