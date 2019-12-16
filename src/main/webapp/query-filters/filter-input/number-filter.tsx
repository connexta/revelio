import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import { Map, getIn } from 'immutable'
import { useFilterContext } from '../filter-context'

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

const validateNumber = (num: string) => {
  const errors: any = {}
  if (num === '') {
    errors.value = 'A value must be entered'
  }
  return errors
}

const FloatInput = (props: any) => {
  const errors = validateNumber(props.value)
  return (
    <TextField
      error={errors.value !== undefined}
      helperText={errors.value}
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
  const errors = validateNumber(props.value)
  return (
    <TextField
      error={errors.value !== undefined}
      helperText={errors.value}
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

const NumberFilter = (props: QueryFilterProps) => {
  const context = useFilterContext()
  const isInt = isInteger(
    getIn(context.metacardTypes, [props.property, 'type'], 'INTEGER')
  )
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
