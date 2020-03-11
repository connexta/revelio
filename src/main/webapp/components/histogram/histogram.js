import React, { useState } from 'react'
import { List, Map, Set, fromJS } from 'immutable'

import Autocomplete from '@material-ui/lab/Autocomplete'
import { CustomTooltip } from '../tooltip'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { formatDateString, getFileSize, isValidDate } from '../../utils'

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

const getResultId = result => {
  return result.getIn(['metacard', 'attributes', 'id'])
}

const getAttributeSet = result => {
  return result
    .getIn(['metacard', 'attributes'])
    .keySeq()
    .toSet()
}

const getAttributeValue = (result, attribute) => {
  return result.getIn(['metacard', 'attributes']).get(attribute)
}

const getAttributeKeysFromResults = results => {
  return results.reduce((acc, data) => {
    return acc.merge(getAttributeSet(data))
  }, Set())
}

const getResultsContainingAttribute = (results, attribute) => {
  return results.filter(result => {
    const attributes = getAttributeSet(result)
    return attributes.includes(attribute)
  })
}

const prettyifyValue = (value, attribute) => {
  if (attribute == 'resource-size') {
    return getFileSize(value)
  }

  if (isValidDate(value)) {
    return formatDateString(value, 'MMM DD YYYY')
  }
  return value
}

const mapMultiValueAttrToResults = (values, result) => {
  return values.reduce((listAcc, listValue) => {
    return listAcc.update(listValue, (val = List()) => val.push(result))
  }, Map())
}

const mapAttrValuesToResults = (results, attribute) => {
  return results.reduce((acc, result) => {
    const value = getAttributeValue(result, attribute)

    // if this => { value: ['text', 'collection', 'image'], attribute: 'datatype' }
    if (List.isList(value)) {
      // get this => {'text': result3, 'collection': result3, 'image': result3}*/
      const listValues = mapMultiValueAttrToResults(value, result)
      /*
        merge this => {'text': result3, 'collection': result3, 'image': result3}
        into this => { 
          {'collection':  [result1, result2]} 
          {'text':  [result1, result2]} 
          {'image':  [result1, result2]} 
        }*/
      return acc.mergeWith((oldVal, newVal) => oldVal.push(newVal), listValues)
    }

    const attrValue = prettyifyValue(value, attribute)
    return acc.update(attrValue, (val = List()) => val.push(result))
  }, Map())
}

const Histogram = props => {
  const [attribute, setAttribute] = useState(null)
  const { results, onSelect } = props
  const values = fromJS(results || {})

  const attributeSet = getAttributeKeysFromResults(values)
  const options = attributeSet.toJS()

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <AttributeSelect
        attributes={options}
        value={attribute}
        onChange={setAttribute}
      />
      <Graph
        selectedAttribute={attribute}
        results={values}
        onSelect={onSelect}
      />
    </div>
  )
}

const Graph = props => {
  const { selectedAttribute, results, onSelect } = props

  const matchingResults = getResultsContainingAttribute(
    results,
    selectedAttribute
  )

  if (matchingResults.isEmpty()) {
    return null
  }

  const attributeValueMap = mapAttrValuesToResults(
    matchingResults,
    selectedAttribute
  )
  const columnWidth = 100 / attributeValueMap.size

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
          <LineContainer
            columnWidth={columnWidth}
            attributeCount={results.size}
            selectedAttribute={selectedAttribute}
            attributeMap={attributeValueMap}
            onSelect={onSelect}
          />
          <BarLabels
            attributeMap={attributeValueMap}
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

const BarLabels = props => {
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
        .map(attribute => {
          return (
            <div
              key={attribute}
              style={{
                width: `${columnWidth}%`,
              }}
            >
              <BarLabel label={attribute} />
            </div>
          )
        })}
    </div>
  )
}

const BarLabel = props => {
  const { label } = props
  return (
    <CustomTooltip title={label}>
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
        {label}
      </Typography>
    </CustomTooltip>
  )
}

const renderBars = (total, valueMap, columnWidth, onSelect) => {
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
          onClick={() => {
            const ids = attributeValues.map(getResultId)
            onSelect(ids)
          }}
        />
      )
    })
  return barsAgain
}

const LineContainer = props => {
  const { attributeCount, attributeMap, columnWidth, onSelect } = props
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

      {renderBars(attributeCount, attributeMap, columnWidth, onSelect)}
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
