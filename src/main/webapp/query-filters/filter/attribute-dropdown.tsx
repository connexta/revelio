import * as React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import { QueryFilterProps } from './individual-filter'
import { getDefaultValue } from './filter-utils'
import { getIn } from 'immutable'
import {
  sampleAttributeDefinitions,
  AttributeDefinition,
} from './dummyDefinitions'
import { Comparators } from './comparator-dropdown'
const AttributeDropdown = (props: QueryFilterProps) => {
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

export default AttributeDropdown
