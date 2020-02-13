import * as React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import { QueryFilterProps } from './individual-filter'
import { getDefaultValue } from './filter-utils'
import { getIn } from 'immutable'
import sampleAttributeDefinitions from './sample-attribute-definitions'
import { Comparators } from './comparator-dropdown'
import LinearProgress from '@material-ui/core/LinearProgress'
import { AttributeDefinition } from '../types'
import useAttributeDefinitions from '../../react-hooks/use-attribute-definitions'
import ErrorMessage from '../../error'
const useApolloFallback = require('../../react-hooks/use-apollo-fallback')
  .default
const AttributeDropdown = (
  props: QueryFilterProps & { attributeDefinitions?: AttributeDefinition[] }
) => {
  const { attributeDefinitions = sampleAttributeDefinitions, filter } = props

  const getType = (property: string) => {
    return getIn(
      attributeDefinitions.find(definition => definition.id === property),
      ['type'],
      'STRING'
    ) as AttributeDefinition['type']
  }
  return (
    <Box>
      <Autocomplete
        disableClearable
        options={attributeDefinitions.map(definition => definition.id)}
        value={filter.property}
        onChange={(_, newProperty: string) => {
          const prevType = getType(filter.property)
          const newType = getType(newProperty)
          if (prevType !== newType) {
            props.onChange({
              type: Comparators[newType].options[0],
              property: newProperty,
              value: getDefaultValue(newType),
            })
          } else {
            props.onChange({
              ...filter,
              property: newProperty,
            })
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            label="Attribute"
            variant="outlined"
            fullWidth
          />
        )}
        disabled={props.editing === false}
      />
    </Box>
  )
}

const AttributeDefinitionsContainer = (props: QueryFilterProps) => {
  const {
    loading,
    error,
    attributeDefinitions,
    refetch,
  } = useAttributeDefinitions()
  if (loading) {
    return <LinearProgress />
  }

  if (error) {
    return (
      <ErrorMessage onRetry={refetch} error={error}>
        Error Retrieveing Attributes
      </ErrorMessage>
    )
  }

  return (
    <AttributeDropdown {...props} attributeDefinitions={attributeDefinitions} />
  )
}

export default (props: QueryFilterProps) => {
  const Component = useApolloFallback(
    AttributeDefinitionsContainer,
    AttributeDropdown
  )
  return <Component {...props} />
}
