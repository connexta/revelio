import * as React from 'react'
import { QueryFilterProps } from '../filter/filter'
import { TextField, Box } from '@material-ui/core'
import { Map } from 'immutable'

export const comparatorOptions = ['ILIKE', 'LIKE', '=', 'NEAR', 'IS NULL']
export const comparatorAliases = Map({
  ILIKE: 'CONTAINS',
  LIKE: 'MATCHCASE',
  'IS NULL': 'IS EMPTY',
})

const intRegex = /^(-?\d*$)|^$/

const TextFilter = (props: QueryFilterProps) => {
  return (
    <TextField
      placeholder="Use * for wildcard"
      variant="outlined"
      fullWidth
      onChange={event => {
        const { property, type } = props
        const value = event.target.value
        props.onChange({ property, type, value })
      }}
      value={props.value}
    />
  )
}

const NearFilter = (props: QueryFilterProps) => {
  return (
    <Box style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <TextField
        variant="outlined"
        style={{ width: '45%' }}
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
