import * as React from 'react'
import TextFilter from '../filter-inputs/text-filter'
import LocationFilter from '../filter-inputs/location-filter'
import DateFilter from '../filter-inputs/date-filter'
import BooleanFilter from '../filter-inputs/boolean-filter'
import NumberFilter from '../filter-inputs/number-filter'
// const FilterCard = require('../../basic-search').FilterCard
// @ts-ignore require not working in storybook for some reason
import { FilterCard } from '../../basic-search'
import { getIn } from 'immutable'
import sampleAttributeDefinitions from './sample-attribute-definitions'
import { deserialize, serialize } from './filter-serialization'
import { QueryFilter, AttributeDefinition } from '../types'
import useAttributeDefinitions from '../../react-hooks/use-attribute-definitions'
import LinearProgress from '@material-ui/core/LinearProgress'
import ErrorMessage from '../../error'
const useApolloFallback = require('../../react-hooks/use-apollo-fallback')
  .default

export type QueryFilterProps = {
  onChange: (value: QueryFilter) => void
  onRemove?: () => void
  editing?: boolean
  filter: QueryFilter
}

const Inputs: any = {
  LOCATION: LocationFilter,
  GEOMETRY: LocationFilter,
  DATE: DateFilter,
  BOOLEAN: BooleanFilter,
  //Strings
  STRING: TextFilter,
  XML: TextFilter,
  //Numbers
  FLOAT: NumberFilter,
  DOUBLE: NumberFilter,
  INTEGER: NumberFilter,
  SHORT: NumberFilter,
  LONG: NumberFilter,
}

const withSerialization = (Component: any) => {
  return (props: any) => {
    const { attributeDefinitions = sampleAttributeDefinitions } = props
    return (
      <Component
        {...props}
        filter={deserialize(props.filter, attributeDefinitions)}
        onChange={(value: any) => {
          props.onChange(serialize(value, attributeDefinitions))
        }}
      />
    )
  }
}

const IndividualFilter = withSerialization(
  (
    props: QueryFilterProps & { attributeDefinitions?: AttributeDefinition[] }
  ) => {
    const { attributeDefinitions = sampleAttributeDefinitions, filter } = props

    const getType = (property: string) => {
      return getIn(
        attributeDefinitions.find(definition => definition.id === property),
        ['type'],
        'STRING'
      )
    }
    const type = getType(filter.property)
    const Component = Inputs[type] || TextFilter
    return (
      <FilterCard label={filter.property} onRemove={props.onRemove}>
        <Component {...props} />
      </FilterCard>
    )
  }
)

const AttributeDefinitionsContainer = (props: QueryFilterProps) => {
  const {
    loading,
    error,
    attributeDefinitions,
    refetch,
  } = useAttributeDefinitions()
  if (loading) {
    return <LinearProgress />
  }

  if (error) {
    return (
      <ErrorMessage onRetry={refetch} error={error}>
        Error Retrieving Attributes
      </ErrorMessage>
    )
  }

  return (
    <IndividualFilter {...props} attributeDefinitions={attributeDefinitions} />
  )
}

export default (props: QueryFilterProps) => {
  const Component = useApolloFallback(
    AttributeDefinitionsContainer,
    IndividualFilter
  )
  return <Component {...props} />
}
