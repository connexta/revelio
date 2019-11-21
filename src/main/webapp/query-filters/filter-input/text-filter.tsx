import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'
import { TextField, Box } from '@material-ui/core'
import { Map, getIn } from 'immutable'
import { useFilterContext } from '../filter-context'
import Autocomplete from '@material-ui/lab/Autocomplete'

export const comparatorOptions = ['ILIKE', 'LIKE', '=', 'NEAR', 'IS NULL']
export const comparatorAliases = Map({
  ILIKE: 'CONTAINS',
  LIKE: 'MATCHCASE',
  'IS NULL': 'IS EMPTY',
})

const intRegex = /^(\d*$)|^$/

const validateText = (value: any) => {
  let errors: any = {}
  if (value === '') errors.value = 'A value must be entered'
  return errors
}

const TextFilter = (props: QueryFilterProps) => {
  const { metacardTypes } = useFilterContext()
  const errors = validateText(props.value)
  return (
    <Autocomplete
      freeSolo
      disableClearable
      options={getIn(metacardTypes, [props.property, 'enums'], [])}
      value={props.value}
      onChange={(_, value: any) => {
        const { property, type } = props
        props.onChange({ property, type, value })
      }}
      renderInput={params => (
        <TextField
          {...params}
          error={errors.value !== undefined}
          helperText={errors.value}
          placeholder="Use * for wildcard"
          variant="outlined"
          fullWidth
        />
      )}
    />
  )
}

const validateNear = (value: any) => {
  let errors: any = {}
  if (value.value === '') {
    errors.value = 'A value must be entered'
  }
  if (value.distance === '') {
    errors.distance = 'A value must be entered'
  } else if (value.distance === '0') {
    errors.distance = 'A value greater than 0 must be entered'
  }
  return errors
}

const NearFilter = (props: QueryFilterProps) => {
  const errors = validateNear(props.value)

  return (
    <Box style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <TextField
        variant="outlined"
        style={{ width: '45%' }}
        error={errors.value !== undefined}
        helperText={errors.value}
        onChange={event => {
          const { property, type } = props
          const value = event.target.value
          props.onChange({
            property,
            type,
            value: { ...props.value, value },
          })
        }}
        value={props.value.value}
      />
      <Box style={{ margin: 10 }} component="span">
        within
      </Box>
      <TextField
        variant="outlined"
        error={errors.distance !== undefined}
        helperText={errors.distance}
        style={{ width: 100 }}
        onChange={event => {
          const { property, type } = props
          const value = event.target.value
          if (!value.match(intRegex)) return
          props.onChange({
            property,
            type,
            value: { ...props.value, distance: value },
          })
        }}
        value={props.value.distance}
      />
    </Box>
  )
}

const Filter = (props: QueryFilterProps) => {
  return (
    <React.Fragment>
      {props.type !== 'NEAR' ? (
        <TextFilter {...props} />
      ) : (
        <NearFilter {...props} />
      )}
    </React.Fragment>
  )
}
export default Filter
