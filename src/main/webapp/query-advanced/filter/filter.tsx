import * as React from 'react'
import { Box } from '@material-ui/core'
import {
  withDivider,
  withRemoveButton,
  getDefaultValue,
  filterComponentStyle,
} from './filter-utils'
import { metacardDefinitions, MetacardType } from './dummyDefinitions'
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
import { AttributeMenu, ComparatorMenu } from './filter-dropdowns'
import NumberFilter, {
  comparatorOptions as numberComparators,
} from '../filter-input/number-filter'

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
  FLOAT: { options: numberComparators, aliases: undefined },
  DOUBLE: { options: numberComparators, aliases: undefined },
  INTEGER: { options: numberComparators, aliases: undefined },
  SHORT: { options: numberComparators, aliases: undefined },
  LONG: { options: numberComparators, aliases: undefined },
}

export const Filter = withRemoveButton(
  withDivider((props: QueryFilterProps) => {
    const type = metacardDefinitions.get(props.property) || 'STRING'
    const Component = Inputs[type] || TextFilter
    const comparators = Comparators[type]
    const comparatorOptions =
      props.property !== 'anyText' && props.property !== 'anyGeo'
        ? comparators.options
        : comparators.options.filter((option: string) => option !== 'IS EMPTY')

    const comparatorAliases = comparators.aliases
    return (
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: '325px',
          maxWidth: '400px',
        }}
      >
        <AttributeMenu
          onChange={(newProperty: MetacardType) => {
            const { property, type, value } = props
            const prevType = metacardDefinitions.get(property) || 'STRING'
            const newType = metacardDefinitions.get(newProperty) || 'STRING'
            if (prevType !== newType) {
              const newOptions = Comparators[newType].options
              props.onChange({
                type: newOptions[0],
                property: newProperty,
                value: getDefaultValue(newType),
              })
            } else {
              props.onChange({ type, value, property: newProperty })
            }
          }}
          selected={props.property}
        />
        {type !== 'LOCATION' && type !== 'DATE' ? (
          <ComparatorMenu
            onChange={(val: string) => {
              const { property, value } = props
              props.onChange({ property, value, type: val })
            }}
            selected={props.type}
            options={comparatorOptions}
            aliases={comparatorAliases}
          />
        ) : null}

        {props.type !== 'IS EMPTY' && (
          <Box style={filterComponentStyle}>
            <Component {...props} />
          </Box>
        )}
      </Box>
    )
  })
)
