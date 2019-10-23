import * as React from 'react'
import { QueryFilterProps } from '../filter/filter'
import { TextField } from '@material-ui/core'
import { metacardDefinitions } from '../filter/dummyDefinitions'

export const comparatorOptions = ['>', '<', '=', '>=', '<=', 'IS EMPTY']

const intRegex = /^(-?\d*$)|^$/
const floatRegex = /^-?\d*(\.\d*)?$|^$/

const isInteger = (type: any) =>
  type === 'INTEGER' || type === 'SHORT' || type === 'LONG'

//TODO Convert value to number on way out of query-advanced - currently being passed as string
const NumberFilter = (props: QueryFilterProps) => {
  let onChange
  if (isInteger(metacardDefinitions.get(props.property))) {
    onChange = (event: any) => {
      const { property, type } = props
      const value = event.target.value
      if (value.match(intRegex)) {
        props.onChange({ property, type, value })
      }
    }
  } else {
    onChange = (event: any) => {
      const { property, type } = props
      const value = event.target.value
      if (value.match(floatRegex)) {
        props.onChange({ property, type, value })
      }
    }
  }

  return (
    <React.Fragment>
      <TextField
        variant="outlined"
        fullWidth
        value={props.value}
        onChange={onChange}
      />
    </React.Fragment>
  )
}
export default NumberFilter
