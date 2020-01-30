import * as React from 'react'
import FacetedDropdown from './faceted-dropdown'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import LinearProgress from '@material-ui/core/LinearProgress'
import { getIn } from 'immutable'
const { useApolloFallback } = require('./react-hooks')
const MATCHTYPE_ATTRIBUTE = gql`
  query getAttributeSuggestionList {
    systemProperties {
      basicSearchMatchType
    }
  }
`

type Props = {
  value: string[]
  errors: any
  onChange: (val: string[]) => void
  matchTypeAttribute?: string
}

const MatchTypes = (props: Props) => {
  const errors = props.errors

  const facetAttribute = props.matchTypeAttribute || 'datatype'

  return (
    <FacetedDropdown
      label="Match Types"
      facetAttribute={facetAttribute}
      error={errors}
      multiple
      value={props.value}
      onChange={e => props.onChange(e.target.value as string[])}
      renderValue={(selected: string[]) => selected.join(', ')}
    />
  )
}

const Container = (props: Props) => {
  const { data, loading } = useQuery(MATCHTYPE_ATTRIBUTE)
  if (loading) {
    return <LinearProgress />
  }

  const matchTypeAttribute = getIn(
    data,
    ['systemProperties', 'basicSearchMatchType'],
    'datatype'
  )
  return <MatchTypes {...props} matchTypeAttribute={matchTypeAttribute} />
}

export default (props: Props) => {
  const Component = useApolloFallback(Container, MatchTypes)
  return <Component {...props} />
}
