import * as React from 'react'
import Box from '@material-ui/core/Box'
import { getDefaultValue, filterComponentStyle } from './filter-utils'
import { MetacardType } from './dummyDefinitions'
import TextFilter, {
  comparatorOptions as textComparators,
  comparatorAliases as textAliases,
} from '../filter-input/text-filter'
import LocationFilter from '../filter-input/location-filter'
import DateFilter, {
  comparatorOptions as dateComparators,
  comparatorAliases as dateAliases,
} from '../filter-input/date-filter'
import BooleanFilter, {
  comparatorOptions as booleanComparators,
  comparatorAliases as booleanAliases,
} from '../filter-input/boolean-filter'
import ComparatorDropdown from './comparator-dropdown'
import NumberFilter, {
  comparatorOptions as numberComparators,
  comparatorAliases as numberAliases,
} from '../filter-input/number-filter'
import { transformValue } from './value-transformations'
import AttributeDropdown from './attribute-dropdown'
import { useFilterContext } from '../filter-context'
import { getIn } from 'immutable'
import { serialize, deserialize } from './filter-serialization'
// const FilterCard = require('../../basic-search').FilterCard
// @ts-ignore require not working in storybook for some reason
import { FilterCard } from '../../basic-search'

export type QueryFilter = {
  property: string //property name, ex: anyText
  type: string // cql operator, ex: ILIKE
  value: any
}
export type QueryFilterProps = QueryFilter & {
  onChange: (value: QueryFilter) => void
  onRemove?: () => void
  editing?: boolean
}

const Inputs = {
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

const Comparators = {
  BOOLEAN: { options: booleanComparators, aliases: booleanAliases },
  DATE: { options: dateComparators, aliases: dateAliases },
  LOCATION: { options: textComparators, aliases: textAliases },
  GEOMETRY: { options: textComparators, aliases: textAliases },
  //Strings
  STRING: { options: textComparators, aliases: textAliases },
  XML: { options: textComparators, aliases: textAliases },
  BINARY: { options: textComparators, aliases: textAliases },
  //Numbers
  FLOAT: { options: numberComparators, aliases: numberAliases },
  DOUBLE: { options: numberComparators, aliases: numberAliases },
  INTEGER: { options: numberComparators, aliases: numberAliases },
  SHORT: { options: numberComparators, aliases: numberAliases },
  LONG: { options: numberComparators, aliases: numberAliases },
}

const withSerialization = (Component: any) => {
  return (props: any) => {
    const { metacardTypes } = useFilterContext()
    return (
      <Component
        {...deserialize(props, metacardTypes)}
        onChange={(value: any) => {
          props.onChange(serialize(value, metacardTypes))
        }}
      />
    )
  }
}

export default withSerialization((props: QueryFilterProps) => {
  const { metacardTypes } = useFilterContext()
  const getType = (property: string) => {
    return getIn(metacardTypes, [property, 'type'], 'STRING') as MetacardType
  }
  const type = getType(props.property)
  const Component = Inputs[type] || TextFilter
  const comparators = Comparators[type]

  const comparatorOptions =
    props.property !== 'anyText' && props.property !== 'anyGeo'
      ? comparators.options
      : comparators.options.filter((option: string) => option !== 'IS NULL')

  const comparatorAliases = comparators.aliases
  return (
    <Box style={{ width: 'fit-content' }}>
      <FilterCard label={props.property} onRemove={props.onRemove}>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '400px',
            overflow: 'visible',
          }}
        >
          <AttributeDropdown
            value={props.property}
            onChange={(newProperty: string) => {
              const { property, type, value } = props
              const prevType = getType(property)
              const newType = getType(newProperty)
              if (prevType !== newType) {
                const newComparators = Comparators[newType].options
                props.onChange({
                  type: newComparators[0],
                  property: newProperty,
                  value: getDefaultValue(newType),
                })
              } else {
                props.onChange({ type, value, property: newProperty })
              }
            }}
            editing={props.editing}
          />
          {type !== 'LOCATION' && type !== 'GEOMETRY' ? (
            <ComparatorDropdown
              onChange={(newOperator: string) => {
                let { property, value, type: oldOperator } = props

                const newValue = transformValue({
                  propertyType: getType(property),
                  currentValue: value,
                  oldOperator,
                  newOperator,
                })

                props.onChange({ property, value: newValue, type: newOperator })
              }}
              selected={props.type}
              options={comparatorOptions}
              aliases={comparatorAliases}
              editing={props.editing}
            />
          ) : null}

          {props.type !== 'IS NULL' && (
            <Box style={filterComponentStyle}>
              <Component {...props} />
            </Box>
          )}
        </Box>
      </FilterCard>
    </Box>
  )
})
