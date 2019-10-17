import * as React from 'react'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import { Button, Box, Popover, MenuItem } from '@material-ui/core'
import { ArrowDropDown as DropDownIcon } from '@material-ui/icons'
import { metacardDefinitions } from './dummyDefinitions'

const comparatorList = ['ILIKE', 'MATCHCASE', '=']

type MenuProps = {
  selected: any
  options: Array<any>
  aliases: any
  onChange: (value: any) => void
  style?: React.CSSProperties
}

const Menu = (props: MenuProps) => {
  const [anchorEl, open, close] = useAnchorEl()
  return (
    <React.Fragment>
      <Button {...props} variant="outlined" onClick={open as any}>
        <Box style={{ width: '100%' }}>
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
            {props.aliases[props.selected] || props.selected}
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
              {props.aliases[option] || option}
            </MenuItem>
          )
        })}
      </Popover>
    </React.Fragment>
  )
}

const attributeAliases = {
  'date-created': 'Date Created',
  enterprise: 'Enterprise',
}

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

const cqlToComparator = {
  ILIKE: 'CONTAINS',
  LIKE: 'MATCHCASE',
  '=': 'EQUALS',
  'IS NULL': 'IS EMPTY',
  '>': '>',
  '<': '<',
  '<=': '<=',
  '>=': '>=',
  BETWEEN: 'RANGE',
}

const withComparatorOptions = (Component: any) => {
  return (props: any) => {
    return (
      <Component
        {...props}
        options={comparatorList}
        aliases={cqlToComparator}
      />
    )
  }
}

export const AttributeMenu = withAttributeOptions(Menu)
export const ComparatorMenu = withComparatorOptions(Menu)
