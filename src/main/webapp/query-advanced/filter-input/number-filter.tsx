import * as React from 'react'
import { QueryFilterProps } from '../filter/filter'
import { TextField, Box } from '@material-ui/core'
import { metacardDefinitions } from '../filter/dummyDefinitions'
import { Map } from 'immutable'

export const comparatorOptions = [
  '>',
  '<',
  '=',
  '>=',
  '<=',
  'BETWEEN',
  'IS NULL',
]
export const comparatorAliases = Map({
  BETWEEN: 'RANGE',
  'IS NULL': 'IS EMPTY',
})

const intRegex = /^(-?\d*$)|^$/
const floatRegex = /^-?\d*(\.\d*)?$|^$/

const isInteger = (type: any) =>
  type === 'INTEGER' || type === 'SHORT' || type === 'LONG'

const FloatInput = (props: any) => {
  return (
    <TextField
      onChange={event => {
        const value = event.target.value
        if (value.match(floatRegex)) {
          props.onChange(value)
        }
      }}
      value={props.value}
      variant="outlined"
      style={{ width: 100 }}
    />
  )
}

const IntegerInput = (props: any) => {
  return (
    <TextField
      onChange={event => {
        const value = event.target.value
        if (value.match(intRegex)) {
          props.onChange(value)
        }
      }}
      value={props.value}
      variant="outlined"
      style={{ width: 100 }}
    />
  )
}
const NumberInput = (props: any) => {
  if (props.isInt) {
    return <IntegerInput {...props} />
  } else {
    return <FloatInput {...props} />
  }
}

//TODO Convert value to number on way out of query-advanced - currently being passed as string
const NumberFilter = (props: QueryFilterProps) => {
  const isInt = isInteger(metacardDefinitions.get(props.property))
  if (props.type !== 'BETWEEN') {
    return (
      <NumberInput
        isInt={isInt}
        onChange={(value: string) => {
          const { property, type } = props
          props.onChange({ property, type, value })
        }}
        value={props.value}
      />
    )
  } else {
    return (
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <NumberInput
          isInt={isInt}
          onChange={(value: string) => {
            const { property, type } = props
            props.onChange({
              property,
              type,
              value: { ...props.value, lower: value },
            })
          }}
          value={props.value.lower}
        />
        <Box style={{ margin: 10 }} component="span">
          TO
        </Box>
        <NumberInput
          isInt={isInt}
          onChange={(value: string) => {
            const { property, type } = props
            props.onChange({
              property,
              type,
              value: { ...props.value, upper: value },
            })
          }}
          value={props.value.upper}
        />
      </Box>
    )
  }
}

export default NumberFilter
