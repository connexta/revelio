import * as React from 'react'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import { Button, Popover, MenuItem } from '@material-ui/core'
import { ArrowDropDown } from '@material-ui/icons'
import { filterHeaderButtonStyle } from './filter-utils'
const operators = ['AND', 'OR', 'NOT AND', 'NOT OR']

const withOperators = (Component: any) => {
  return (props: any) => {
    return <Component operators={operators} {...props} />
  }
}

type OperatorProps = {
  operators: Array<string>
  selected: string
  onChange: (value: string) => void
}

const Operator = withOperators((props: OperatorProps) => {
  const [anchorEl, open, close] = useAnchorEl()
  return (
    <React.Fragment>
      <Button
        style={filterHeaderButtonStyle}
        variant="outlined"
        onClick={open as any}
      >
        {props.selected}
        <ArrowDropDown />
      </Button>
      <Popover
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        onClose={close}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl as any}
      >
        {props.operators.map(operator => {
          return (
            <MenuItem
              onClick={() => {
                close()
                props.onChange(operator)
              }}
              key={operator}
            >
              {operator}
            </MenuItem>
          )
        })}
      </Popover>
    </React.Fragment>
  )
})

export default Operator
