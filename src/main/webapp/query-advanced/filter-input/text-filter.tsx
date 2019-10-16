import * as React from 'react'
import { QueryFilterProps } from '../filter/filter'
import { Box, TextField } from '@material-ui/core'
import { AttributeMenu, ComparatorMenu } from '../filter/filter-dropdowns'
import { filterComponentStyle, getDefaultValue } from '../filter/filter-utils'
import metacardDefinitions, { MetacardType } from './metacard-types'

const TextFilter = (props: QueryFilterProps) => {
  return (
    <React.Fragment>
      <Box>
        <AttributeMenu
          onChange={(newProperty: MetacardType) => {
            const { property, type, value } = props
            const prevType = metacardDefinitions.get(property)
            const newType = metacardDefinitions.get(newProperty)
            if (prevType !== newType) {
              props.onChange({
                type,
                property: newProperty,
                value: getDefaultValue(newType),
              })
            } else {
              props.onChange({ type, value, property: newProperty })
            }
          }}
          style={{ width: '48%', float: 'left', ...filterComponentStyle }}
          selected={props.property}
        />
        <ComparatorMenu
          onChange={(val: string) => {
            const { property, value } = props
            props.onChange({ property, value, type: val })
          }}
          style={{ width: '48%', float: 'right', ...filterComponentStyle }}
          selected={props.type}
        />
      </Box>

      <TextField
        placeholder="Use * for wildcard"
        variant="outlined"
        fullWidth
        style={{ ...filterComponentStyle }}
        onChange={event => {
          const { property, type } = props
          props.onChange({ property, type, value: event.target.value })
        }}
      />
    </React.Fragment>
  )
}
export default TextFilter
