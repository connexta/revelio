import * as React from 'react'
import { QueryFilterProps } from '../filter/individual-filter'

import Box from '@material-ui/core/Box'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'

import AttributeDropdown from '../filter/attribute-dropdown'
import ComparatorDropdown from '../filter/comparator-dropdown'

const BooleanFilter = (props: QueryFilterProps) => {
  return (
    <React.Fragment>
      <AttributeDropdown {...props} />
      <ComparatorDropdown
        {...props}
        onChange={(newOperator: string) => {
          const { property, type: oldOperator } = props
          if (newOperator !== oldOperator) {
            if (newOperator === 'IS NULL') {
              props.onChange({ property, type: newOperator, value: null })
            } else {
              props.onChange({ property, type: newOperator, value: false })
            }
          }
        }}
      />
      {props.type !== 'IS NULL' && (
        <Box>
          <Button
            variant="outlined"
            onClick={() => {
              props.onChange({
                value: !props.value,
                type: props.type,
                property: props.property,
              })
            }}
          >
            <Switch checked={props.value !== false} />
            {String(props.value !== false)}
          </Button>
        </Box>
      )}
    </React.Fragment>
  )
}

export default BooleanFilter
