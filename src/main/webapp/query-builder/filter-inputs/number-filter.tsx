import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'
import TextField from '@material-ui/core/TextField'
import { getIn } from 'immutable'
import Box from '@material-ui/core/Box'
import AttributeDropdown from '../filter/attribute-dropdown'
import ComparatorDropdown from '../filter/comparator-dropdown'
import sampleAttributeDefinitions from '../filter/sample-attribute-definitions'

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
  const { attributeDefinitions = sampleAttributeDefinitions, filter } = props

  const getType = (property: string) => {
    return getIn(
      attributeDefinitions.find(definition => definition.id === property),
      ['type'],
      'INTEGER'
    )
  }
  const isInt = isInteger(getType(filter.property))
  if (filter.type !== 'BETWEEN') {
    return (
      <NumberInput
        isInt={isInt}
        onChange={(value: string) => {
          props.onChange({ ...filter, value })
        }}
        value={filter.value}
      />
    )
  } else {
    return (
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <NumberInput
          isInt={isInt}
          onChange={(value: string) => {
            props.onChange({
              ...filter,
              value: { ...filter.value, lower: value },
            })
          }}
          value={filter.value.lower}
        />
        <Box style={{ margin: 10 }} component="span">
          TO
        </Box>
        <NumberInput
          isInt={isInt}
          onChange={(value: string) => {
            props.onChange({
              ...filter,
              value: { ...filter.value, upper: value },
            })
          }}
          value={filter.value.upper}
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
  const { filter } = props
  return (
    <React.Fragment>
      <AttributeDropdown {...props} />
      <ComparatorDropdown
        {...props}
        onChange={(newOperator: string) => {
          const { property, type: oldOperator, value: oldValue } = filter
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
      {filter.type !== 'IS NULL' && (
        <Box>
          <NumberFilter {...props} />
        </Box>
      )}
    </React.Fragment>
  )
}
