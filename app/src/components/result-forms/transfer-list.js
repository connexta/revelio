import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import RedoIcon from '@material-ui/icons/Redo'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import UndoIcon from '@material-ui/icons/Undo'

const Attributes = props => {
  const [text, setText] = useState('')

  const { title, attributes = [], onSelect } = props

  const filtered = attributes.filter(type => type.match(text))

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
            {filtered.length !== attributes.length
              ? ` (${filtered.length}/${attributes.length} visible)`
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
          {filtered.map(type => {
            return (
              <ListItem key={type} button onClick={() => onSelect([type])}>
                <ListItemText primary={type} />
              </ListItem>
            )
          })}
        </List>
      </Card>
    </div>
  )
}

const HistoryControls = props => {
  const { canUndo, onUndo, canRedo, onRedo } = props
  return (
    <div>
      <Button variant="outlined" onClick={onUndo} disabled={!canUndo}>
        <UndoIcon /> Undo
      </Button>
      <div style={{ width: 10, display: 'inline-block' }} />
      <Button variant="outlined" onClick={onRedo} disabled={!canRedo}>
        <RedoIcon /> Redo
      </Button>
    </div>
  )
}

const TransferList = props => {
  const { state, setState, attributes = [], ...rest } = props

  const selected = attributes.filter(a => state.has(a))
  const available = attributes.filter(a => !state.has(a))

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

        <HistoryControls {...rest} />
      </div>

      <div
        style={{ display: 'flex', flex: '1', overflow: 'hidden', padding: 3 }}
      >
        <Attributes
          title="Available"
          attributes={available}
          onSelect={a => setState(state.union(a))}
        />

        <div style={{ width: 20 }} />

        <Attributes
          title="Selected"
          attributes={selected}
          onSelect={a => setState(state.subtract(a))}
        />
      </div>
    </div>
  )
}

export default TransferList
