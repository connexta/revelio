import React, { useState } from 'react'
import { Set } from 'immutable'
import { useKeyPressed, useSelectionInterface } from '../react-hooks'

import Paper from '@material-ui/core/Card'
import Table from '@material-ui/core/Table'
import Typography from '@material-ui/core/Typography'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import More from '@material-ui/icons/UnfoldMore'
import Less from '@material-ui/icons/UnfoldLess'
import Thumbnail from '../thumbnail/thumbnail'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'

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

const getCellContent = (attribute, result) => {
  const { properties } = result.metacard
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
          <Thumbnail src={properties.thumbnail} />
        </div>
      )
    case 'description':
      return <Description text={properties.description} />
    default:
      return (
        <Typography style={{ ...cellStyles }}>
          {properties[attribute]}
        </Typography>
      )
  }
}

const getId = result => result.metacard.properties.id

const Result = props => {
  const { attributes, selected, onClick, onSelect, onRemove, result } = props
  const id = getId(result)
  return (
    <TableRow
      onClick={onClick}
      key={id}
      selected={selected}
      style={{ cursor: 'pointer' }}
    >
      <TableCell>
        <Checkbox
          checked={selected}
          onClick={e => {
            e.stopPropagation()
            if (e.target.checked) {
              onSelect()
            } else {
              onRemove()
            }
          }}
        />
      </TableCell>
      {attributes.map(attribute => (
        <TableCell key={attribute}>
          {getCellContent(attribute.toLowerCase(), result)}
        </TableCell>
      ))}
    </TableRow>
  )
}

const computeSelected = (selection, results, start, end, e) => {
  const clicked = getId(results[end])
  if (e.ctrlKey || e.metaKey) {
    return selection.has(clicked)
      ? selection.remove(clicked)
      : selection.add(clicked)
  }
  if (e.shiftKey && start !== null) {
    const slice =
      start < end
        ? results.slice(start, end + 1)
        : results.slice(end, start + 1)
    const group = Set(slice.map(result => getId(result)))
    return group.union(selection)
  }
  return selection.has(clicked) ? Set() : Set([getId(results[end])])
}

const Results = props => {
  const { results, attributes, onSelect } = props
  const selection = Set(props.selection)
  const [lastSelected, setLastSelected] = useState(null)
  const allowTextSelect = !useKeyPressed('Shift')

  const all = Set(results.map(getId))

  const allSelected = all.subtract(selection).isEmpty()

  return (
    <Paper style={{ overflow: 'auto', maxHeight: '100%' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={allSelected}
                onChange={e => {
                  if (e.target.checked) {
                    onSelect(all)
                  } else {
                    onSelect(Set())
                  }
                }}
              />
            </TableCell>
            {attributes.map(attribute => (
              <TableCell key={attribute}>
                <Typography>{attribute}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody style={{ userSelect: allowTextSelect ? 'auto' : 'none' }}>
          {results.map((result, i) => {
            const id = getId(result)
            return (
              <Result
                key={id}
                result={result}
                attributes={attributes}
                selected={selection.has(id)}
                onRemove={() => {
                  onSelect(selection.remove(id))
                }}
                onSelect={() => {
                  onSelect(selection.add(id))
                }}
                onClick={e => {
                  e.stopPropagation()
                  const selected = computeSelected(
                    selection,
                    results,
                    lastSelected,
                    i,
                    e
                  )
                  onSelect(selected)
                  setLastSelected(e.shiftKey ? lastSelected : i)
                }}
              />
            )
          })}
        </TableBody>
      </Table>
    </Paper>
  )
}

const Container = prop => {
  const [selection, onSelect] = useSelectionInterface()
  return <Results {...prop} selection={selection} onSelect={onSelect} />
}

export { Results }
export default Container
