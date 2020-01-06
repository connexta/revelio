import * as React from 'react'
import TextFilter from '../filter-input/text-filter'
import LocationFilter from '../filter-input/location-filter'
import DateFilter from '../filter-input/date-filter'
import BooleanFilter from '../filter-input/boolean-filter'
import NumberFilter from '../filter-input/number-filter'
// const FilterCard = require('../../basic-search').FilterCard
// @ts-ignore require not working in storybook for some reason
import { FilterCard } from '../../basic-search'
import { getIn } from 'immutable'
import {
  AttributeDefinition,
  sampleAttributeDefinitions,
} from './dummyDefinitions'
import { deserialize, serialize } from './filter-serialization'
import { geometry } from 'geospatialdraw'

export type QueryFilter = {
  property: string //property name, ex: anyText
  type: string // cql operator, ex: ILIKE
  value: any
  geojson?: geometry.GeometryJSON
}
export type QueryFilterProps = QueryFilter & {
  onChange: (value: QueryFilter) => void
  onRemove?: () => void
  editing?: boolean
  attributeDefinitions?: AttributeDefinition[]
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
        {...deserialize(props, attributeDefinitions)}
        onChange={(value: any) => {
          props.onChange(serialize(value, attributeDefinitions))
        }}
      />
    )
  }
}

export default withSerialization((props: QueryFilterProps) => {
  const { attributeDefinitions = sampleAttributeDefinitions } = props

  const getType = (property: string) => {
    return getIn(
      attributeDefinitions.find(definition => definition.id === property),
      ['type'],
      'STRING'
    )
  }
  const type = getType(props.property)
  const Component = Inputs[type] || TextFilter
  return (
    <FilterCard label={props.property} onRemove={props.onRemove}>
      <Component {...props} />
    </FilterCard>
  )
})
