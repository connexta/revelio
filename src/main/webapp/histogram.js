import React, { useState } from 'react'
import { List, Map, Set, fromJS } from 'immutable'

import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const AttributeSelect = props => {
  const { attributes, value, onChange } = props

  return (
    <Autocomplete
      options={attributes}
      defaultValue={value}
      autoSelect
      disableClearable
      onChange={(event, value) => {
        onChange(value)
      }}
      renderInput={params => (
        <TextField {...params} margin="normal" fullWidth />
      )}
    />
  )
}

const Histogram = props => {
  const [attribute, setAttribute] = useState(null)
  const { results } = props
  const values = fromJS(results || {})
  const attrSet = values.reduce((acc, data) => {
    return acc.merge(
      data
        .getIn(['metacard', 'properties'])
        .keySeq()
        .toSet()
    )
  }, Set())

  const filteredResults = values.filter(result => {
    const attributes = result
      .getIn(['metacard', 'properties'])
      .keySeq()
      .toSet()
    return attributes.includes(attribute)
  })

  const attrMap = filteredResults.reduce((acc, result) => {
    const attributes = result.getIn(['metacard', 'properties'])
    const value = attributes.get(attribute)
    return acc.update(value, (val = List()) => val.push(result))
  }, Map())

  const options = attrSet.toJS()

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <AttributeSelect
        attributes={options}
        value={attribute}
        onChange={setAttribute}
      />
      {attrMap.isEmpty() ? null : (
        <Graph
          attributeCount={values.size}
          selectedAttribute={attribute}
          attributeMap={attrMap}
        />
      )}
    </div>
  )
}

const Graph = props => {
  const { attributeCount, selectedAttribute, attributeMap } = props
  const columnWidth = 100 / attributeMap.size

  return (
    <div className="graph-wrapper">
      <div
        className="graphcontainer"
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        <div
          className="graph"
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            height: '800px',
            width: '100%',
          }}
        >
          <BarLinesContainer
            columnWidth={columnWidth}
            attributeCount={attributeCount}
            selectedAttribute={selectedAttribute}
            attributeMap={attributeMap}
          />
          <BarTextContent
            attributeMap={attributeMap}
            columnWidth={columnWidth}
          />
        </div>
      </div>
    </div>
  )
}

const Line = props => {
  const { left } = props
  return (
    <div
      className="line"
      style={{
        position: 'absolute',
        height: '1px',
        width: '100%',
        background: 'rgba(0, 0, 0, 0.4)',
        top: `${left}%`,
      }}
    />
  )
}

const BarTextContent = props => {
  const { attributeMap, columnWidth } = props

  return (
    <div
      className="bar-text-content"
      style={{
        display: 'flex',
        alignItems: 'start',
        position: 'relative',
        width: '100%',
        height: '12%',
      }}
    >
      {attributeMap
        .keySeq()
        .toList()
        .map(attr => {
          return (
            <div
              key={attr}
              style={{
                width: `${columnWidth}%`,
              }}
            >
              <Typography
                align="center"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginLeft: '3px',
                  marginRight: '3px',
                }}
              >
                {attr}
              </Typography>
            </div>
          )
        })}
    </div>
  )
}

const renderBars = (total, valueMap, columnWidth) => {
  const maxHits = valueMap
    .valueSeq()
    .toList()
    .max((a, b) => a.size - b.size).size

  const barsAgain = valueMap
    .keySeq()
    .toList()
    .map(attr => {
      const attributeValues = valueMap.get(attr)
      const percent = (attributeValues.size / maxHits) * 95
      return (
        <Bar
          hits={attributeValues.size}
          columnWidth={columnWidth}
          percent={percent}
          key={attr}
          onClick={() => {}}
        />
      )
    })
  return barsAgain
}

const BarLinesContainer = props => {
  const { attributeCount, attributeMap, columnWidth } = props
  return (
    <div
      className="bar-lines-container"
      style={{
        display: 'flex',
        position: 'relative',
        height: '100%',
        width: '100%',
        alignItems: 'flex-end',
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
        return <Line left={i * 10} key={i} />
      })}

      {renderBars(attributeCount, attributeMap, columnWidth)}
    </div>
  )
}

const Bar = props => {
  const { percent, onClick, columnWidth, hits } = props

  return (
    <div
      style={{
        height: '100%',
        width: `${columnWidth}%`,
      }}
    >
      <Typography
        style={{
          height: `${100 - percent}%`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {hits}
      </Typography>
      <div
        className="bar"
        style={{
          height: `${percent}%`,
          borderTop: '1px solid #222',
          borderRight: '1px solid #222',
          borderLeft: '1px solid #222',
          margin: 1,
          background: 'rgba(0, 0, 0, 0.1)',
        }}
        onClick={onClick}
      />
    </div>
  )
}

export default Histogram
