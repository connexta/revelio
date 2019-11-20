import * as React from 'react'
import Select from '@material-ui/lab/Autocomplete'
import { Box } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { useFilterContext } from '../filter-context'

const AttributeDropdown = (props: any) => {
  const context = useFilterContext()
  return (
    <Box style={{ margin: 5 }}>
      <Select
        autoSelect
        disableClearable
        options={Object.keys(context.metacardTypes)}
        value={props.value}
        onChange={(_, value: any) => {
          props.onChange(value)
        }}
        renderInput={params => <TextField {...params} fullWidth />}
        disabled={!context.editing}
      />
    </Box>
  )
}

export default AttributeDropdown
