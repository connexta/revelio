import * as React from 'react'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Popover from '@material-ui/core/Popover'
import MenuItem from '@material-ui/core/MenuItem'
import DropDownIcon from '@material-ui/icons/ArrowDropDown'
import { Map } from 'immutable'
import { useFilterContext } from '../filter-context'

type Props = {
  selected: string
  options: Array<string>
  aliases?: Map<string, string>
  onChange: (value: string) => void
  style?: React.CSSProperties
}

const ComparatorMenu = (props: Props) => {
  const [anchorEl, open, close] = useAnchorEl()
  const context = useFilterContext()
  return (
    <React.Fragment>
      <Button
        style={{ width: 'fit-content', margin: 5 }}
        variant="outlined"
        onClick={open as any}
        disabled={!context.editing}
      >
        <Box>
          <Box
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            justifyContent="left"
            maxWidth="calc(100% - 24px)"
            component="span"
          >
            {props.aliases
              ? props.aliases.get(props.selected) || props.selected
              : props.selected}
          </Box>
          <DropDownIcon style={{ float: 'right' }} />
        </Box>
      </Button>
      <Popover
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        onClose={close}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl as any}
      >
        {props.options.map(option => {
          return (
            <MenuItem
              onClick={() => {
                close()
                props.onChange(option)
              }}
              key={option}
              value={option}
            >
              {props.aliases ? props.aliases.get(option) || option : option}
            </MenuItem>
          )
        })}
      </Popover>
    </React.Fragment>
  )
}

export default ComparatorMenu
