import { useQuery } from '@apollo/react-hooks'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import gql from 'graphql-tag'
import { getIn } from 'immutable'
import React, { useEffect } from 'react'
import OutlinedSelect from '../../input/outlined-select'
import { useApolloFallback } from '../../react-hooks'
import LinearProgress from '@material-ui/core/LinearProgress'
import ErrorMessage from '../network-retry/inline-retry'

const resultForms = gql`
  query SearchFormsAttributeGroup {
    metacardsByTag(tag: "attribute-group") {
      attributes {
        id
        title
      }
    }
    user {
      preferences {
        querySettings {
          detail_level
        }
      }
    }
  }
`

const ResultForms = props => {
  useEffect(() => {
    if (!props.value && props.defaultValue) {
      props.onChange(props.defaultValue)
    }
  }, [])

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

        {props.resultForms &&
          props.resultForms.map(resultForm => (
            <MenuItem key={resultForm.id} value={resultForm.title}>
              {resultForm.title}
            </MenuItem>
          ))}
      </OutlinedSelect>
    </FormControl>
  )
}

const Container = props => {
  const { data, loading, error, refetch } = useQuery(resultForms)

  if (loading) return <LinearProgress />

  if (error)
    return (
      <ErrorMessage onRetry={refetch} error={error}>
        Error Retrieveing Result Forms
      </ErrorMessage>
    )

  return (
    <ResultForms
      {...props}
      resultForms={getIn(data, ['metacardsByTag', 'attributes'])}
      defaultValue={getIn(
        data,
        ['user', 'preferences', 'querySettings', 'detail_level'],
        null
      )}
    />
  )
}

export default props => {
  const Component = useApolloFallback(Container, ResultForms)
  return <Component {...props} />
}
