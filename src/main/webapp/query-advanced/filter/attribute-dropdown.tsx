import * as React from 'react'
import Select from '@material-ui/lab/Autocomplete'
import { Map } from 'immutable'
import { Box } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { useFilterContext } from '../filter-context'

const attributeAliases = Map({
  'date-created': 'Date Created',
  enterprise: 'Enterprise',
})

const AttributeDropdown = (props: any) => {
  const context = useFilterContext()
  return (
    <Box style={{ margin: 5 }}>
      <Select
        autoSelect
        disableClearable
        options={context.includedAttributes}
        value={props.value}
        onChange={(_, value: any) => {
          props.onChange(value)
        }}
        renderInput={params => <TextField {...params} fullWidth />}
        disabled={!context.editing}
        getOptionLabel={option => {
          return attributeAliases.get(option) || option
        }}
      />
    </Box>
  )
}

export default AttributeDropdown
