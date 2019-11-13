import * as React from 'react'
import Select from 'react-select'
import { Map } from 'immutable'
import { Box } from '@material-ui/core'
import { useFilterContext } from '../filter-context'

const attributeAliases = Map({
  'date-created': 'Date Created',
  enterprise: 'Enterprise',
})

const createOption = (option: string) => ({
  value: option,
  label: attributeAliases.get(option) || option,
})

const AttributeDropdown = (props: any) => {
  const context = useFilterContext()
  const options = context.includedAttributes.map(createOption)
  const value = options.find(option => option.value === props.value)
  return (
    <Box style={{ margin: 5 }}>
      <Select
        options={options}
        value={value}
        onChange={(option: any) => {
          props.onChange(option.value)
        }}
        isDisabled={!context.editing}
      />
    </Box>
  )
}

export default AttributeDropdown
