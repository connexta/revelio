import * as React from 'react'
import { Box } from '@material-ui/core'
import {
  withDivider,
  withRemoveButton,
  getDefaultValue,
  filterComponentStyle,
} from './filter-utils'
import { metacardDefinitions } from './dummyDefinitions'
import TextFilter, {
  comparatorOptions as textComparators,
  comparatorAliases as textAliases,
} from '../filter-input/text-filter'
import LocationFilter from '../filter-input/location-filter'
import DateFilter, {
  comparatorOptions as dateComparators,
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
import { FROM, TO } from './value-transformations'
import AttributeDropdown from './attribute-dropdown'

//In this format to make querying easy
export type QueryFilter = {
  property: string
  type: string
  value: any
}
export type QueryFilterProps = QueryFilter & {
  onChange: (value: QueryFilter) => void
  onRemove?: () => void
}

const Inputs = {
  LOCATION: LocationFilter,
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
  DATE: { options: dateComparators, aliases: undefined },
  LOCATION: { options: textComparators, aliases: textAliases },
  //Strings
  STRING: { options: textComparators, aliases: textAliases },
  XML: { options: textComparators, aliases: textAliases },
  //Numbers
  FLOAT: { options: numberComparators, aliases: numberAliases },
  DOUBLE: { options: numberComparators, aliases: numberAliases },
  INTEGER: { options: numberComparators, aliases: numberAliases },
  SHORT: { options: numberComparators, aliases: numberAliases },
  LONG: { options: numberComparators, aliases: numberAliases },
}

export const Filter = withRemoveButton(
  withDivider((props: QueryFilterProps) => {
    const type = metacardDefinitions.get(props.property) || 'STRING'
    const Component = Inputs[type] || TextFilter
    const comparators = Comparators[type]

    const comparatorOptions =
      props.property !== 'anyText' && props.property !== 'anyGeo'
        ? comparators.options
        : comparators.options.filter((option: string) => option !== 'IS NULL')

    const comparatorAliases = comparators.aliases
    return (
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: '325px',
          maxWidth: '400px',
          overflow: 'visible',
        }}
      >
        <AttributeDropdown
          value={props.property}
          onChange={(newProperty: string) => {
            const { property, type, value } = props
            const prevType = metacardDefinitions.get(property) || 'STRING'
            const newType = metacardDefinitions.get(newProperty) || 'STRING'
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
        />
        {type !== 'LOCATION' && type !== 'DATE' ? (
          <ComparatorDropdown
            onChange={(newType: string) => {
              let { property, value } = props
              if (newType !== props.type) {
                if (FROM[props.type] !== undefined) {
                  value = FROM[props.type](value)
                } else if (TO[newType] !== undefined) {
                  value = TO[newType](value)
                }
              }
              props.onChange({ property, value, type: newType })
            }}
            selected={props.type}
            options={comparatorOptions}
            aliases={comparatorAliases}
          />
        ) : null}

        {props.type !== 'IS NULL' && (
          <Box style={filterComponentStyle}>
            <Component {...props} />
          </Box>
        )}
      </Box>
    )
  })
)
