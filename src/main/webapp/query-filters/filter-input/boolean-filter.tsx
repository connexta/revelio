import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'

import Box from '@material-ui/core/Box'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'

import { Map } from 'immutable'

export const comparatorOptions = ['=', 'IS NULL']
export const comparatorAliases = Map({ '=': 'IS', 'IS NULL': 'IS EMPTY' })

const BooleanFilter = (props: QueryFilterProps) => {
  return (
    <React.Fragment>
      <Box
        onClick={() => {
          props.onChange({
            value: !props.value,
            type: props.type,
            property: props.property,
          })
        }}
        style={{ width: 'fit-content' }}
      >
        <Button variant="outlined">
          <Switch checked={props.value !== false} />
          {String(props.value !== false)}
        </Button>
      </Box>
    </React.Fragment>
  )
}

export default BooleanFilter
