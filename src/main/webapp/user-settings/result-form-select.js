import { useQuery } from '@apollo/react-hooks'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import gql from 'graphql-tag'
import { getIn } from 'immutable'
import React from 'react'
import OutlinedSelect from '../input/outlined-select'
import { useApolloFallback } from '../react-hooks'

const resultForms = gql`
  query SearchForms {
    metacardsByTag(tag: "attribute-group") {
      attributes {
        id
        title
      }
    }
  }
`

const ResultForms = props => {
  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <OutlinedSelect
        label="Result Form"
        value={props.value || 0}
        onChange={e => {
          props.onChange(e.target.value !== 0 ? e.target.value : null)
        }}
      >
        <MenuItem key={'allFields'} value={0}>
          All Fields
        </MenuItem>

        {props.resultForms.map(resultForm => (
          <MenuItem key={resultForm.id} value={resultForm.title}>
            {resultForm.title}
          </MenuItem>
        ))}
      </OutlinedSelect>
    </FormControl>
  )
}

const Container = props => {
  const { error, data, loading } = useQuery(resultForms)

  return loading || error ? null : (
    <ResultForms
      {...props}
      resultForms={getIn(data, ['metacardsByTag', 'attributes'])}
    />
  )
}

export default props => {
  const Component = useApolloFallback(Container, ResultForms)
  return <Component {...props} />
}
