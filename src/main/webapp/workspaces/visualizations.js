import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { useSelectionInterface } from '../react-hooks'

import { Layout, Provider, AddConfig, DragSource } from '../react-layout'

import Inspector from '../inspector/inspector'
import ResultTable from '../results/results'

import WorldMap from '../world-map'
import { RENDERER_STYLE } from '../map-style'
import WKT from 'ol/format/WKT'
import GeoJSON from 'ol/format/GeoJSON'
import { geometry, coordinates, shapes } from 'geospatialdraw'

const AddVisualization = () => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const options = {
    '2D Map': {
      type: 'component',
      title: '2D Map',
      componentName: '2d-map',
    },
    Table: {
      type: 'component',
      title: 'Table',
      componentName: 'table',
    },
    Inspector: {
      type: 'component',
      title: 'Inspector',
      componentName: 'inspector',
    },
  }

  return (
    <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="primary"
        variant="contained"
      >
        Add Visual
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(options).map(option => {
          const config = options[option]

          return (
            <MenuItem key={option} onClick={() => handleClose(option)}>
              <DragSource config={config}>
                <AddConfig config={config}>{option}</AddConfig>
              </DragSource>
            </MenuItem>
          )
        })}
      </Menu>
    </div>
  )
}

const config = {
  content: [
    {
      type: 'row',
      content: [
        {
          type: 'component',
          title: 'Table',
          componentName: 'table',
        },
      ],
    },
  ],
}

const VisContainer = ({ children }) => {
  return (
    <div
      style={{
        padding: 20,
        boxSizing: 'border-box',
        overflow: 'auto',
        height: '100%',
        width: '100%',
      }}
    >
      {children}
    </div>
  )
}

const Visualizations = props => {
  const { results } = props

  const InspectorVis = () => {
    const [selected] = useSelectionInterface()

    const selectedResults = results.filter(result => {
      return selected.has(result.metacard.properties.id)
    })

    return (
      <VisContainer>
        <Inspector results={selectedResults} />
      </VisContainer>
    )
  }

  const TableVis = () => {
    return (
      <VisContainer>
        <ResultTable
          attributes={['id', 'title', 'created']}
          results={results}
        />
      </VisContainer>
    )
  }

  const wkt = new WKT({ splitCollection: true })
  const geoJSON = new GeoJSON()
  const shapeDetector = new shapes.ShapeDetector()
  const MapVis = () => {
    const PROJECTION = 'EPSG:4326'
    const [selected] = useSelectionInterface()
    const geos = results
      .map(
        result =>
          result.metacard.properties.location
            ? wkt
                .readFeatures(result.metacard.properties.location)
                .map(feature =>
                  geometry.makeGeometry(
                    result.metacard.properties.id,
                    geoJSON.writeFeatureObject(feature),
                    '',
                    shapeDetector.shapeFromFeature(feature),
                    0,
                    geometry.METERS,
                    {
                      selected: selected.has(result.metacard.properties.id),
                    }
                  )
                )
            : []
      )
      .reduce((list, value) => list.concat(value), [])
    const selectedExtents = geos
      .filter(g => g.properties.selected)
      .map(g => g.bbox)
    const viewport =
      selectedExtents.length > 0
        ? geometry.combineExtents(selectedExtents)
        : null
    return (
      <WorldMap
        projection={PROJECTION}
        style={RENDERER_STYLE}
        coordinateType={coordinates.LAT_LON}
        maxZoom={20}
        minZoom={1.5}
        zoom={2}
        geos={geos}
        viewport={viewport}
      />
    )
  }

  const components = {
    inspector: InspectorVis,
    table: TableVis,
    '2d-map': MapVis,
  }

  return (
    <Provider>
      <div style={{ position: 'relative', height: 'calc(100vh - 64px)' }}>
        <Layout
          config={config}
          components={components}
          onChange={() => {
            /*console.log(config)*/
          }}
        />
        <AddVisualization />
      </div>
    </Provider>
  )
}

export default Visualizations
