import React, { useState } from 'react'

import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import DroppableList from './draggable-column-list'

const Attributes = props => {
  const [text, setText] = useState('')
  const { title, columns, onSelect } = props

  const filtered = columns.filter(column => column.title.match(text))

  return (
    <div style={{ maxHeight: '100%', flex: '1', alignItems: 'stretch' }}>
      <Card
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <CardContent style={{ paddingBottom: 0 }}>
          <Typography variant="h6" color="textSecondary">
            {title}
            {filtered.length !== columns.length
              ? ` (${filtered.length}/${columns.length} visible)`
              : null}
          </Typography>
          <TextField
            fullWidth
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="type to filter..."
          />
        </CardContent>
        <List dense={true} style={{ flex: '1', overflow: 'auto' }}>
          {filtered.filter(column => column.hidden).map(column => {
            return (
              <ListItem
                key={column.title}
                button
                onClick={() => {
                  column.hidden = false
                  onSelect(column)
                }}
              >
                <ListItemText primary={column.title} />
              </ListItem>
            )
          })}
        </List>
      </Card>
    </div>
  )
}

const TransferList = props => {
  const { columns, setColumnOrder } = props
  const [state, setState] = useState(columns)

  const onColumnChange = updatedColumns => {
    setState(updatedColumns)
    setColumnOrder(updatedColumns)
  }

  const onSelect = columns => updatedColumn => {
    const updatedColumns = columns.map(column => {
      if (column.title === updatedColumn.title) {
        column.hidden = updatedColumn.hidden
      }
      return column
    })

    onColumnChange(updatedColumns)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 3,
          marginBottom: 10,
        }}
      >
        <div>
          <FormLabel required={props.required} error={props.error}>
            {props.label}
          </FormLabel>
          <FormHelperText error={props.error}>
            {props.helperText}
          </FormHelperText>
        </div>
      </div>

      <div
        style={{ display: 'flex', flex: '1', overflow: 'hidden', padding: 3 }}
      >
        <DisplayedColumns
          title="Displayed Columns"
          onSelect={onSelect(state)}
          columns={state}
          onColumnChange={onColumnChange}
        />
        <div style={{ width: 20 }} />
        <Attributes
          title="Hidden Columns"
          columns={columns}
          onSelect={onSelect(state)}
        />
      </div>
    </div>
  )
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const [lr] = list.splice(startIndex, 1)
  list.splice(endIndex, 0, lr)
  list.forEach((column, index) => (column.tableData.columnOrder = index))

  return list
}

const DisplayedColumns = props => {
  const [text, setText] = useState('')
  const { title, onSelect, columns, onColumnChange } = props

  const displayedColumns = columns.filter(type => !type.hidden)
  const filtered = displayedColumns.filter(type => type.title.match(text))

  const isDragDisabled = filtered.length !== displayedColumns.length

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const these_items = reorder(
      columns,
      result.source.index,
      result.destination.index
    )

    //write it back up
    onColumnChange(these_items)
  }

  return (
    <div style={{ maxHeight: '100%', flex: '1', alignItems: 'stretch' }}>
      <Card
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <CardContent style={{ paddingBottom: 0 }}>
          <Typography variant="h6" color="textSecondary">
            {title}
            {isDragDisabled
              ? ` (${filtered.length}/${displayedColumns.length} visible)`
              : null}
          </Typography>
          <TextField
            fullWidth
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="type to filter..."
          />
        </CardContent>
        <DroppableList
          onColumnChange={onColumnChange}
          onSelect={onSelect}
          onDragEnd={onDragEnd}
          columns={columns}
          isDragDisabled={isDragDisabled}
          filterText={text}
        />
      </Card>
    </div>
  )
}

export default TransferList
