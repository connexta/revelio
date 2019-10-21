import * as React from 'react'
import { QueryFilterProps } from '../filter/filter'
import { Box, Switch, Button } from '@material-ui/core'
import { Map } from 'immutable'

export const comparatorOptions = ['=', 'IS EMPTY']
export const comparatorAliases = Map({ '=': 'IS' })

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
