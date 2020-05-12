import React, { useState, memo } from 'react'
import { Set, fromJS, OrderedSet } from 'immutable'
import {
  useKeyPressed,
  useSelectionInterface,
  useUserPrefs,
} from '../../react-hooks'

import { mergeDeepOverwriteLists } from '../../utils'

import Typography from '@material-ui/core/Typography'
import More from '@material-ui/icons/UnfoldMore'
import Less from '@material-ui/icons/UnfoldLess'
import Thumbnail from '../thumbnail/thumbnail'
import Button from '@material-ui/core/Button'

import LinearProgress from '@material-ui/core/LinearProgress'

import ErrorMessage from '../network-retry/inline-retry'
import Dialog from '@material-ui/core/Dialog'

import TransferList from './transfer-list'
const MemoizedTransferList = memo(TransferList)
import ResultsTable from './result-material-table'

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

const Expandable = props => {
  const [expanded, setExpanded] = useState(false)
  const { text = '' } = props
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

const TransferListModal = props => {
  const { open, onClose, onColumnUpdate } = props

  const [columnOrder, setColumnOrder] = useState(OrderedSet())

  const handleCancel = () => {
    onClose()
  }

  const handleSave = () => {
    const order = columnOrder.map(column => column.original)
    const columnHide = columnOrder
      .filter(column => column.hidden)
      .map(column => column.original)

    if (typeof onColumnUpdate === 'function') {
      onColumnUpdate({ columnOrder: order, columnHide })
    }

    onClose()
  }

  return (
    <Dialog open={open}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '100%',
          padding: 20,
          boxSizing: 'border-box',
          ...props.style,
        }}
      >
        <MemoizedTransferList setColumnOrder={setColumnOrder} {...props} />
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}
        >
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <div style={{ width: 10, display: 'inline-block' }} />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

const ColumnOptions = props => {
  const { columns, onColumnUpdate } = props
  const [show, setShow] = useState(false)

  return (
    <div style={{ maxWidth: '100%' }}>
      <TransferListModal
        label="Columns"
        open={show}
        onClose={() => {
          setShow(false)
        }}
        onColumnUpdate={onColumnUpdate}
        columns={columns}
        required
      />
      <Button
        onClick={() => {
          setShow(!show)
        }}
      >
        Columns
      </Button>
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
    default:
      return <Expandable text={value} />
  }
}

const RenderAttribute = field => rowData => {
  return getCellContent(field, rowData[field])
}

const fixFieldAttribute = attribute => {
  if (attribute.includes('.')) {
    return attribute.replace('.', '_')
  }

  return attribute
}

const attributeToColumn = (attribute, hidden = true) => {
  return {
    title: attribute,
    field: fixFieldAttribute(attribute),
    original: attribute,
    render: RenderAttribute(attribute),
    hidden,
  }
}

const attributesToColumns = (attributes, columnOrder, columnHide) => {
  const mutableAttributes = attributes.asMutable()

  const orderedColumns = columnOrder.map(attribute => {
    if (mutableAttributes.includes(attribute)) {
      mutableAttributes.delete(attribute)
    }
    return attributeToColumn(attribute, columnHide.includes(attribute))
  })

  const otherColumns = mutableAttributes.map(attribute => {
    return attributeToColumn(attribute, columnHide.includes(attribute))
  })

  return [...orderedColumns, ...otherColumns]
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
  const {
    results,
    onSelect,
    columnOrder = [],
    hiddenColumns = [],
    onColumnUpdate,
  } = props
  const selection = Set(props.selection)
  const [lastSelected, setLastSelected] = useState(null)
  const allowTextSelect = !useKeyPressed('Shift')

  if (Set(results).isEmpty()) {
    return (
      <Typography align="center" variant="h6">
        Please select a result set to display the table.
      </Typography>
    )
  }

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

  const resultAttributes = getAttributeKeysFromResults(fromJS(results))

  const columns = attributesToColumns(
    resultAttributes,
    columnOrder,
    hiddenColumns
  )

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
      <ColumnOptions columns={columns} onColumnUpdate={onColumnUpdate} />
      <ResultsTable
        columns={columns}
        data={data}
        onSelect={onSelect}
        onRowClick={onRowClick}
        allowTextSelect={allowTextSelect}
        onColumnUpdate={onColumnUpdate}
      />
    </div>
  )
}

const LoadingComponent = () => <LinearProgress />

const Container = props => {
  const [
    userPrefs,
    updateUserPrefs,
    { error, loading, refetch },
  ] = useUserPrefs()

  if (loading) {
    return <LoadingComponent />
  }
  if (error) {
    return (
      <ErrorMessage onRetry={refetch} error={error}>
        Error Retrieving Column Order
      </ErrorMessage>
    )
  }

  const onColumnUpdate = columnChanges => {
    const newPreferences = mergeDeepOverwriteLists(
      fromJS(userPrefs),
      fromJS(columnChanges)
    )

    updateUserPrefs(newPreferences.toJS())
  }

  return (
    <WithSelectionInterface
      {...props}
      columnOrder={userPrefs.columnOrder || props.attributes || []}
      hiddenColumns={userPrefs.columnHide}
      onColumnUpdate={onColumnUpdate}
    />
  )
}

const WithSelectionInterface = props => {
  const [selection, onSelect] = useSelectionInterface()
  return <Results {...props} selection={selection} onSelect={onSelect} />
}

export { Results }
export default Container
