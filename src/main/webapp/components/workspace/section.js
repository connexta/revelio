import React, { useState } from 'react'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'

const Section = ({ title, children, enable, onChange }) => {
  const [open, setOpen] = useState(false)
  const Arrow = open ? KeyboardArrowUpIcon : KeyboardArrowDownIcon
  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        marginTop={1}
      >
        <Box style={{ width: '100%' }}>
          <Divider />
        </Box>
        <Typography
          style={{ height: 'fit-content', whiteSpace: 'nowrap' }}
          color="textPrimary"
        >
          {title}
        </Typography>
        <Switch
          checked={enable}
          onChange={() => {
            onChange({ newEnable: !enable })
            setOpen(false)
          }}
        />
        <IconButton
          onClick={() => {
            if (enable) setOpen(!open)
          }}
        >
          <Arrow />
        </IconButton>
        <Box style={{ width: '100%' }}>
          <Divider />
        </Box>
      </Box>
      <Collapse in={open}>{children}</Collapse>
    </Box>
  )
}

export default Section
