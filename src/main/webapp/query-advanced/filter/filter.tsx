import * as React from 'react'
import { Box } from '@material-ui/core'
import { withDivider, withRemoveButton } from './filter-utils'
import metacardDefinitions, {
  MetacardType,
} from '../filter-input/metacard-types'
import TextFilter from '../filter-input/text-filter'
import LocationFilter from '../filter-input/location-filter'
import DateFilter from '../filter-input/date-filter'

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

const determineInput = (type: MetacardType | undefined) => {
  switch (type) {
    case 'LOCATION':
      return LocationFilter
    case 'DATE':
      return DateFilter
    default:
      return TextFilter
  }
}

//Consolidate Common Filter Components, ex: attribute/comparator dropdown
export const Filter = withRemoveButton(
  withDivider((props: QueryFilterProps) => {
    const Component = determineInput(metacardDefinitions.get(props.property))
    return (
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: '325px',
          maxWidth: '400px',
        }}
      >
        <Component {...props} />
      </Box>
    )
  })
)
