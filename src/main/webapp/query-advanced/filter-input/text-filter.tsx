import * as React from 'react'
import { QueryFilterProps } from '../filter/filter'
import { TextField } from '@material-ui/core'
import { Map } from 'immutable'

export const comparatorOptions = ['ILIKE', 'LIKE', '=', 'IS EMPTY']
export const comparatorAliases = Map({ ILIKE: 'CONTAINS', LIKE: 'MATCHCASE' })

const TextFilter = (props: QueryFilterProps) => {
  return (
    <React.Fragment>
      <TextField
        placeholder="Use * for wildcard"
        variant="outlined"
        fullWidth
        onChange={event => {
          const { property, type } = props
          props.onChange({ property, type, value: event.target.value })
        }}
      />
    </React.Fragment>
  )
}
export default TextFilter
