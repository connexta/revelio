import * as React from 'react'
import { FilterType, Filter } from './filter'
import { Box, Button } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import {
  defaultFilter,
  filterHeaderButtonStyle,
  withDivider,
  withRemoveButton,
} from './filter-utils'
import Operator from './operator'

type FilterGroupType = {
  type: string
  filters: Array<FilterGroupType | FilterType>
}

export type FilterGroupProps = FilterGroupType & {
  limitDepth?: number // Used to limit number of nested groups
  onChange: (value: FilterGroupType) => void
  onRemove?: () => void
}

const isFilterGroup = (
  object: FilterType | FilterGroupType
): object is FilterGroupType => (object as FilterGroupType).type !== undefined

const getValue = (props: FilterGroupProps) => {
  const { type, filters } = props
  return { type, filters }
}

export const FilterGroup = withRemoveButton(
  withDivider((props: FilterGroupProps) => {
    return (
      <Box>
        <Header {...props} />
        <FilterList {...props} />
      </Box>
    )
  })
)

const Header = (props: FilterGroupProps) => {
  return (
    <Box style={{ display: 'flex' }}>
      <Operator
        onChange={(value: string) => {
          props.onChange({ ...getValue(props), type: value })
        }}
        selected={props.type}
      />
      <Button
        onClick={() => {
          const filters = props.filters.slice()
          filters.push({ ...defaultFilter })
          props.onChange({ ...getValue(props), filters })
        }}
        style={filterHeaderButtonStyle}
        variant="outlined"
      >
        <Add fontSize="small" style={{ marginRight: 5 }} />
        <Box style={{ margin: 'auto' }}>Add Field</Box>
      </Button>
      {(props.limitDepth === undefined || props.limitDepth !== 0) && (
        <Button
          style={filterHeaderButtonStyle}
          onClick={() => {
            const filters = props.filters.slice()
            filters.push({ type: 'AND', filters: [{ ...defaultFilter }] })
            props.onChange({ ...getValue(props), filters })
          }}
          variant="outlined"
        >
          <Add fontSize="small" style={{ marginRight: 5 }} />
          <Box style={{ margin: 'auto' }}>Add Group</Box>
        </Button>
      )}
    </Box>
  )
}

const FilterList = (props: FilterGroupProps) => {
  return (
    <Box>
      {props.filters.map((filter, i) => {
        const onChange = (value: FilterGroupType | FilterType) => {
          const filters = props.filters.slice()
          filters[i] = value
          props.onChange({ ...getValue(props), filters })
        }
        const onRemove = () => {
          const filters = props.filters.slice()
          filters.splice(i, 1)
          props.onChange({
            ...getValue(props),
            filters,
          })
        }
        if (isFilterGroup(filter)) {
          return (
            <Box key={i} style={{ margin: 10, marginLeft: 0 }}>
              <FilterGroup
                limitDepth={
                  props.limitDepth !== undefined
                    ? props.limitDepth - 1
                    : undefined
                }
                {...filter}
                onChange={onChange}
                onRemove={onRemove}
              />
            </Box>
          )
        } else {
          return (
            <Box key={i} style={{ margin: 10, marginLeft: 0 }}>
              <Filter {...filter} onChange={onChange} onRemove={onRemove} />
            </Box>
          )
        }
      })}
    </Box>
  )
}
