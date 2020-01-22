import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import { getIn, List } from 'immutable'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import AttributeDropdown from '../filter/attribute-dropdown'
import ComparatorDropdown from '../filter/comparator-dropdown'
import sampleAttributeDefinitions from '../filter/sample-attribute-definitions'
const useApolloFallback = require('../../react-hooks/use-apollo-fallback')
  .default

const intRegex = /^(\d*$)|^$/

const validateText = (value: any) => {
  let errors: any = {}
  if (value === '') errors.value = 'A value must be entered'
  return errors
}

const FACETED_QUERY = gql`
  query getFacetedOptions($attribute: String!) {
    facet(attribute: $attribute) {
      value
    }
  }
`
const FACET_WHITELIST = gql`
  query getAttributeSuggestionList {
    systemProperties {
      attributeSuggestionList
    }
  }
`

const WithFacetedSuggestions = (props: QueryFilterProps) => {
  const { filter } = props
  const { data, loading, error } = useQuery(FACET_WHITELIST)
  if (loading) {
    return <TextFilterContainer {...props} loading={true} />
  }
  if (error) {
    return <TextFilterContainer {...props} />
  }

  const attributeSuggestionList =
    getIn(data, ['systemProperties', 'attributeSuggestionList'], undefined) ||
    []
  if (!attributeSuggestionList.includes(filter.property)) {
    return <TextFilterContainer {...props} />
  }
  return <WithFacetedQuery {...props} />
}

const WithFacetedQuery = (props: QueryFilterProps) => {
  const { filter } = props
  const { data, loading, error } = useQuery(FACETED_QUERY, {
    variables: { attribute: filter.property },
  })

  if (loading) {
    return <TextFilterContainer {...props} loading={true} />
  }
  if (error) {
    return <TextFilterContainer {...props} />
  }

  const enums = getIn(data, ['facet'], []).map((facet: any) => facet.value)

  return <TextFilterContainer {...props} enums={enums} />
}

const TextFilterContainer = (props: TextFilterProps) => {
  const { attributeDefinitions = sampleAttributeDefinitions, filter } = props
  let { enums = [] } = props
  enums = List(
    enums.concat(
      getIn(
        attributeDefinitions.find(
          definition => definition.id === filter.property
        ),
        ['enums'],
        undefined
      ) || []
    )
  )
    .toSet()
    .toArray()

  return <TextFilter {...props} enums={enums} />
}

type TextFilterProps = QueryFilterProps & {
  enums?: string[]
  loading?: boolean
}

const TextFilter = (props: TextFilterProps) => {
  const { enums, filter } = props
  const errors = validateText(filter.value)

  return (
    <Autocomplete
      disableClearable
      autoSelect
      freeSolo
      defaultValue={filter.value} //don't remove defaultValue https://github.com/mui-org/material-ui/issues/19423
      inputValue={filter.value}
      options={enums}
      loading={props.loading}
      onInputChange={(_, value: string) => {
        props.onChange({ ...filter, value })
      }}
      renderInput={params => {
        return (
          <TextField
            {...params}
            error={errors.value !== undefined}
            helperText={errors.value}
            placeholder="Use * for wildcard"
            variant="outlined"
            fullWidth
          />
        )
      }}
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
  const { filter } = props
  const errors = validateNear(filter.value)

  return (
    <Box style={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        variant="outlined"
        fullWidth
        error={errors.value !== undefined}
        helperText={errors.value}
        onChange={event => {
          const value = event.target.value
          props.onChange({
            ...filter,
            value: { ...filter.value, value },
          })
        }}
        value={filter.value.value}
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
          const value = event.target.value
          if (!value.match(intRegex)) return

          props.onChange({
            ...filter,
            value: { ...filter.value, distance: value },
          })
        }}
        value={filter.value.distance}
      />
    </Box>
  )
}

const FROM: any = {
  NEAR: (value: any) => value.value,
  'IS NULL': () => '',
}
const TO: any = {
  NEAR: (value: any) => ({ value, distance: 2 }),
  'IS NULL': () => null,
}

export default (props: QueryFilterProps) => {
  const { filter } = props
  let Component
  if (filter.type === 'NEAR') {
    Component = NearFilter
  } else {
    Component = useApolloFallback(WithFacetedSuggestions, TextFilterContainer)
  }
  return (
    <React.Fragment>
      <AttributeDropdown {...props} />
      <ComparatorDropdown
        {...props}
        onChange={(newOperator: string) => {
          const { property, type: oldOperator, value: oldValue } = filter
          if (oldOperator === newOperator) return
          let newValue = oldValue
          if (FROM[oldOperator] !== undefined) {
            newValue = FROM[oldOperator](newValue)
          }
          if (TO[newOperator] !== undefined) {
            newValue = TO[newOperator](newValue)
          }
          props.onChange({
            type: newOperator,
            value: newValue,
            property,
          })
        }}
      />
      {filter.type !== 'IS NULL' && <Component {...props} />}
    </React.Fragment>
  )
}
