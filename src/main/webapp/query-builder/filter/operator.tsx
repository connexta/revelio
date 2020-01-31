import * as React from 'react'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import { filterHeaderButtonStyle } from './filter-utils'

const operators = ['AND', 'OR', 'NOT AND', 'NOT OR']

type OperatorProps = {
  value: string
  onChange: (value: string) => void
}

const Operator = (props: OperatorProps) => {
  const [anchorEl, open, close] = useAnchorEl()
  return (
    <React.Fragment>
      <Button
        style={filterHeaderButtonStyle}
        variant="outlined"
        onClick={open as any}
        endIcon={<ArrowDropDown />}
      >
        <Typography noWrap>{props.value}</Typography>
      </Button>
      <Popover
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        onClose={close}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl as any}
      >
        {operators.map(operator => {
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
}

export default Operator
