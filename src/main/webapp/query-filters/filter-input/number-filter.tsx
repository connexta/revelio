import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'
import TextField from '@material-ui/core/TextField'
import { getIn } from 'immutable'
import Box from '@material-ui/core/Box'
import AttributeDropdown from '../filter/attribute-dropdown'
import ComparatorDropdown from '../filter/comparator-dropdown'
import { sampleAttributeDefinitions } from '../filter/dummyDefinitions'

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
  const { attributeDefinitions = sampleAttributeDefinitions } = props

  const getType = (property: string) => {
    return getIn(
      attributeDefinitions.find(definition => definition.id === property),
      ['type'],
      'INTEGER'
    )
  }
  const isInt = isInteger(getType(props.property))
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

const FROM: any = {
  BETWEEN: (value: any) => value.lower,
  'IS NULL': () => '',
}

const TO: any = {
  BETWEEN: (value: any) => ({ lower: value, upper: value }),
  'IS NULL': () => null,
}

export default (props: QueryFilterProps) => {
  return (
    <React.Fragment>
      <AttributeDropdown {...props} />
      <ComparatorDropdown
        {...props}
        onChange={(newOperator: string) => {
          const { property, type: oldOperator, value: oldValue } = props
          if (oldOperator === newOperator) return
          let newValue = oldValue
          if (FROM[oldOperator] !== undefined) {
            newValue = FROM[oldOperator](newValue)
          }
          if (TO[newOperator] !== undefined) {
            newValue = TO[newOperator](newValue)
          }
          props.onChange({
            type: newOperator,
            value: newValue,
            property,
          })
        }}
      />
      {props.type !== 'IS NULL' && (
        <Box>
          <NumberFilter {...props} />
        </Box>
      )}
    </React.Fragment>
  )
}
