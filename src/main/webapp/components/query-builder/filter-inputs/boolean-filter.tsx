import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'

import Box from '@material-ui/core/Box'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'

import AttributeDropdown from '../filter/attribute-dropdown'
import ComparatorDropdown from '../filter/comparator-dropdown'

const BooleanFilter = (props: QueryFilterProps) => {
  const { filter } = props
  return (
    <React.Fragment>
      <AttributeDropdown {...props} />
      <ComparatorDropdown
        {...props}
        onChange={(newOperator: string) => {
          const { property, type: oldOperator } = filter
          if (newOperator !== oldOperator) {
            if (newOperator === 'IS NULL') {
              props.onChange({ property, type: newOperator, value: null })
            } else {
              props.onChange({ property, type: newOperator, value: false })
            }
          }
        }}
      />
      {filter.type !== 'IS NULL' && (
        <Box>
          <Button
            variant="outlined"
            onClick={() => {
              props.onChange({
                ...filter,
                value: !filter.value,
              })
            }}
          >
            <Switch checked={filter.value !== false} />
            {String(filter.value !== false)}
          </Button>
        </Box>
      )}
    </React.Fragment>
  )
}

export default BooleanFilter
