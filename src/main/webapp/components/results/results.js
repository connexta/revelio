import React, { useState, forwardRef } from 'react'
import { Set, fromJS } from 'immutable'
import { useKeyPressed, useSelectionInterface } from '../../react-hooks'

import Typography from '@material-ui/core/Typography'
import More from '@material-ui/icons/UnfoldMore'
import Less from '@material-ui/icons/UnfoldLess'
import Thumbnail from '../thumbnail/thumbnail'
import Button from '@material-ui/core/Button'

import MaterialTable from 'material-table'

import AddBox from '@material-ui/icons/AddBox'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
}

const cellStyles = {
  minWidth: 150,
  maxWidth: 450,
}

const ExpandButton = props => {
  const { expanded, onClick } = props
  return (
    <Button
      style={{
        minWidth: 25,
        marginLeft: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClick}
    >
      {expanded ? <Less /> : <More />}
    </Button>
  )
}

const Description = props => {
  const [expanded, setExpanded] = useState(false)
  const { text } = props
  const long = text.length > 250

  return (
    <div
      style={{
        ...cellStyles,
        display: 'flex',
        width: '20vw',
        alignItems: 'stretch',
      }}
    >
      <Typography>
        {!long || expanded ? text : text.substring(0, 100).concat('...')}
      </Typography>
      {long ? (
        <ExpandButton
          expanded={expanded}
          onClick={e => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
        />
      ) : null}
    </div>
  )
}

const computeSelected = (selection, allRows, rowData, start, end, e) => {
  const { id } = rowData
  if (e.ctrlKey || e.metaKey) {
    return selection.has(id) ? selection.remove(id) : selection.add(id)
  }
  if (e.shiftKey && start !== null) {
    const slice =
      start < end
        ? allRows.slice(start, end + 1)
        : allRows.slice(end, start + 1)
    const group = Set(slice.map(row => row.id))
    return group.union(selection)
  }

  return selection.has(id) ? Set() : Set([id])
}

const getCellContent = (attribute, value) => {
  switch (attribute) {
    case 'thumbnail':
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Thumbnail src={value} />
        </div>
      )
    case 'description':
      return <Description text={value} />
    default:
      return <Typography style={{ ...cellStyles }}>{value}</Typography>
  }
}

const RenderAttribute = field => rowData => {
  return getCellContent(field, rowData[field])
}

const attributesToColumns = (attributes, hidden = false) => {
  return attributes.map(attribute => {
    return {
      title: attribute,
      field: attribute,
      render: RenderAttribute(attribute),
      hidden,
    }
  })
}

const allAttributesToColumns = (displayedAttrs, hiddenAttrs) => {
  const displayedColumns = attributesToColumns(displayedAttrs)
  const hiddenColumns = attributesToColumns(hiddenAttrs, true)

  return [...displayedColumns, ...hiddenColumns]
}

const getAttributeSet = result => {
  return result
    .getIn(['metacard', 'attributes'])
    .keySeq()
    .toSet()
}

const getAttributeKeysFromResults = results => {
  return results.reduce((acc, result) => {
    return acc.merge(getAttributeSet(result))
  }, Set())
}

const Results = props => {
  const { results, attributes, onSelect } = props
  const selection = Set(props.selection)
  const [lastSelected, setLastSelected] = useState(null)
  const allowTextSelect = !useKeyPressed('Shift')

  const data = results.map(result => {
    // need the copy because material-table adds a tableData object
    const attributes = Object.assign({}, result.metacard.attributes)
    const { id } = attributes
    if (selection.contains(id)) {
      const tableData = { checked: true }
      attributes.tableData = tableData
    }
    return attributes
  })

  const allAttributes = getAttributeKeysFromResults(fromJS(results))
  const hidden = allAttributes.subtract(fromJS(attributes))

  const columns = allAttributesToColumns(attributes, hidden)

  const onSelectionChange = selectedRows => {
    const selectedIds = selectedRows.map(rowData => rowData.id)
    const setOfIds = Set(selectedIds)
    onSelect(setOfIds)
  }

  const onRowClick = (e, rowData) => {
    e.stopPropagation()
    const rowId = rowData.tableData.id
    const selected = computeSelected(
      selection,
      data,
      rowData,
      lastSelected,
      rowId,
      e
    )
    onSelect(selected)
    setLastSelected(e.shiftKey ? lastSelected : rowId)
  }

  return (
    <div style={{ maxWidth: '100%' }}>
      <MaterialTable
        icons={tableIcons}
        options={{ selection: true, showTitle: false }}
        columns={columns}
        data={data}
        onSelectionChange={onSelectionChange}
        onRowClick={onRowClick}
        style={{
          userSelect: allowTextSelect ? 'auto' : 'none',
        }}
      />
    </div>
  )
}

const Container = props => {
  const [selection, onSelect] = useSelectionInterface()
  return <Results {...props} selection={selection} onSelect={onSelect} />
}

export { Results }
export default Container
