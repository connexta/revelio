import * as React from 'react'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Popover from '@material-ui/core/Popover'
import MenuItem from '@material-ui/core/MenuItem'
import DropDownIcon from '@material-ui/icons/ArrowDropDown'
import { Map, getIn } from 'immutable'
import { QueryFilter } from './individual-filter'
import {
  AttributeDefinition,
  sampleAttributeDefinitions,
} from './dummyDefinitions'

const booleanComparators = ['=', 'IS NULL']
const booleanAliases = Map({ '=': 'IS', 'IS NULL': 'IS EMPTY' })

const dateComparators = ['BEFORE', 'AFTER', 'DURING', '=', 'IS NULL']
const dateAliases = Map({
  BEFORE: 'Before',
  AFTER: 'After',
  DURING: 'Between',
  '=': 'Relative',
  'IS NULL': 'IS EMPTY',
})

const textComparators = ['ILIKE', 'LIKE', '=', 'NEAR', 'IS NULL']
const textAliases = Map({
  ILIKE: 'CONTAINS',
  LIKE: 'MATCHCASE',
  'IS NULL': 'IS EMPTY',
})

export const numberComparators = [
  '>',
  '<',
  '=',
  '>=',
  '<=',
  'BETWEEN',
  'IS NULL',
]
export const numberAliases = Map({
  BETWEEN: 'RANGE',
  'IS NULL': 'IS EMPTY',
})

export const Comparators = {
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

type ComparatorDropdownProps = {
  onChange: (value: string) => void
  editing?: boolean
  attributeDefinitions?: AttributeDefinition[]
  filter: QueryFilter
}

const ComparatorDropdown = (props: ComparatorDropdownProps) => {
  const [anchorEl, open, close] = useAnchorEl()
  const { attributeDefinitions = sampleAttributeDefinitions, filter } = props
  const type = getIn(
    attributeDefinitions.find(definition => definition.id === filter.property),
    ['type'],
    'STRING'
  ) as AttributeDefinition['type']
  let options = Comparators[type].options
  const aliases = Comparators[type].aliases
  if (filter.property === 'anyText' || filter.property === 'anyGeo') {
    options = options.filter(option => option !== 'IS NULL')
  }
  return (
    <React.Fragment>
      <Button
        style={{ width: 'fit-content' }}
        variant="outlined"
        onClick={open as any}
        disabled={props.editing === false}
      >
        <Box>
          <Box
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            justifyContent="left"
            maxWidth="calc(100% - 24px)"
            component="span"
          >
            {aliases ? aliases.get(filter.type) || filter.type : filter.type}
          </Box>
          <DropDownIcon style={{ float: 'right' }} />
        </Box>
      </Button>
      <Popover
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        onClose={close}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl as any}
      >
        {options.map(option => {
          return (
            <MenuItem
              onClick={() => {
                close()
                props.onChange(option)
              }}
              key={option}
              value={option}
            >
              {aliases ? aliases.get(option) || option : option}
            </MenuItem>
          )
        })}
      </Popover>
    </React.Fragment>
  )
}

export default ComparatorDropdown
