import Collapse from '@material-ui/core/Collapse'
import { red } from '@material-ui/core/colors'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import React, { useState } from 'react'

export default props => {
  const [state, setState] = useState(true)
  const { children, label, onRemove } = props

  const spacing = 16
  const Arrow = state ? KeyboardArrowUpIcon : KeyboardArrowDownIcon

  return (
    <Paper style={{ width: '100%', marginTop: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography style={{ padding: 12 }} color="textSecondary">
          {label}
        </Typography>
        <div style={{ display: 'flex' }}>
          <IconButton onClick={() => setState(!state)}>
            <Arrow />
          </IconButton>
          {onRemove && (
            <IconButton style={{ color: red[500] }} onClick={onRemove}>
              <CloseIcon />
            </IconButton>
          )}
        </div>
      </div>
      <Collapse in={state}>
        <Divider />
        <div
          style={{
            padding: spacing,
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>
      </Collapse>
    </Paper>
  )
}
