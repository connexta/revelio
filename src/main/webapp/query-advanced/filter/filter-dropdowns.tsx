import * as React from 'react'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import { Button, Box, Popover, MenuItem } from '@material-ui/core'
import { ArrowDropDown as DropDownIcon } from '@material-ui/icons'
import { metacardDefinitions } from './dummyDefinitions'
import { Map } from 'immutable'

type MenuProps = {
  selected: any
  options: Array<string>
  aliases?: Map<string, string>
  onChange: (value: string) => void
  style?: React.CSSProperties
}

const Menu = (props: MenuProps) => {
  const [anchorEl, open, close] = useAnchorEl()
  return (
    <React.Fragment>
      <Button
        style={{ width: 'fit-content', margin: 5 }}
        variant="outlined"
        onClick={open as any}
      >
        <Box>
          <Box
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              justifyContent: 'left',
              float: 'left',
              maxWidth: 'calc(100% - 24px)',
              textTransform: 'none',
            }}
            component="span"
          >
            {props.aliases
              ? props.aliases.get(props.selected) || String(props.selected)
              : String(props.selected)}
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
              {props.aliases
                ? props.aliases.get(option) || String(option)
                : String(option)}
            </MenuItem>
          )
        })}
      </Popover>
    </React.Fragment>
  )
}

const attributeAliases = Map({
  'date-created': 'Date Created',
  enterprise: 'Enterprise',
})

const withAttributeOptions = (Component: any) => {
  return (props: any) => {
    return (
      <Component
        {...props}
        options={Array.from(metacardDefinitions.keys())}
        aliases={attributeAliases}
      />
    )
  }
}

export const AttributeMenu = withAttributeOptions(Menu)
export const ComparatorMenu = Menu
