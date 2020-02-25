import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'
import TextField from '@material-ui/core/TextField'
import { getIn } from 'immutable'
import Box from '@material-ui/core/Box'
import LinearProgress from '@material-ui/core/LinearProgress'
import AttributeDropdown from '../filter/attribute-dropdown'
import ComparatorDropdown from '../filter/comparator-dropdown'
import sampleAttributeDefinitions from '../../../sample-data/sample-attribute-definitions.json'
import useAttributeDefinitions from '../../../react-hooks/use-attribute-definitions'
import { AttributeDefinition } from '../types'
import { useState } from 'react'
const useApolloFallback = require('../../../react-hooks/use-apollo-fallback')
  .default
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
  const [value, setValue] = useState(props.value)
  const errors = validateNumber(value)
  return (
    <TextField
      error={errors.value !== undefined}
      helperText={errors.value}
      onChange={event => {
        const value = event.target.value
        if (value.match(floatRegex)) {
          setValue(value)
          if (!isNaN(Number(value))) {
            props.onChange(value)
          }
        }
      }}
      value={value}
      variant="outlined"
      style={{ width: 100 }}
    />
  )
}

const IntegerInput = (props: any) => {
  const [value, setValue] = useState(props.value)
  const errors = validateNumber(value)
  return (
    <TextField
      error={errors.value !== undefined}
      helperText={errors.value}
      onChange={event => {
        const value = event.target.value
        if (value.match(intRegex)) {
          setValue(value)
          if (!isNaN(Number(value))) {
            props.onChange(value)
          }
        }
      }}
      value={value}
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

const NumberFilter = (
  props: QueryFilterProps & { attributeDefinitions?: AttributeDefinition[] }
) => {
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

const InputContainer = (props: QueryFilterProps) => {
  const { loading, error, attributeDefinitions } = useAttributeDefinitions()
  if (loading) {
    return <LinearProgress />
  }

  if (error) {
    return <div>{error}</div>
  }

  return <NumberFilter {...props} attributeDefinitions={attributeDefinitions} />
}

export default (props: QueryFilterProps) => {
  const { filter } = props
  const Component = useApolloFallback(InputContainer, NumberFilter)
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
          <Component {...props} />
        </Box>
      )}
    </React.Fragment>
  )
}
