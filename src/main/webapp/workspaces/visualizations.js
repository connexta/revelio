import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { useSelectionInterface } from '../react-hooks'

import { Layout, Provider, AddConfig, DragSource } from '../react-layout'

import Inspector from '../inspector/inspector'
import ResultTable from '../results/results'
import WorldMap from '../world-map'

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

  const MapVis = () => {
    const PROJECTION = 'EPSG:4326'

    return (
      <WorldMap
        projection={PROJECTION}
        coordinateType="LAT LON"
        maxZoom={20}
        minZoom={1.5}
        zoom={2}
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
