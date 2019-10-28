import * as React from 'react'
import Select from 'react-select'
import { metacardDefinitions } from '../filter/dummyDefinitions'
import { Map } from 'immutable'
import { Box } from '@material-ui/core'

const attributeAliases = Map({
  'date-created': 'Date Created',
  enterprise: 'Enterprise',
})

const createOption = (option: string) => ({
  value: option,
  label: attributeAliases.get(option) || option,
})

const AttributeDropdown = (props: any) => {
  const options = Array.from(metacardDefinitions.keys()).map(createOption)
  const value = options.find(option => option.value === props.value)
  return (
    <Box style={{ margin: 5 }}>
      <Select
        options={options}
        value={value}
        onChange={(option: any) => {
          props.onChange(option.value)
        }}
      />
    </Box>
  )
}

export default AttributeDropdown
