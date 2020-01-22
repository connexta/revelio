import * as React from 'react'
import IndividualFilter from './individual-filter'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Add from '@material-ui/icons/Add'
import { defaultFilter, filterHeaderButtonStyle } from './filter-utils'
import Operator from './operator'
import { isFilterGroup } from '../filter'
import Fab from '@material-ui/core/Fab'

import Remove from '@material-ui/icons/Remove'
import { FilterGroupType, QueryFilter, AttributeDefinition } from '../types'

export type FilterGroupProps = {
  limitDepth?: number // Used to limit number of nested groups
  editing?: boolean
  onChange: (value: FilterGroupType) => void
  onRemove?: () => void
  attributeDefinitions?: AttributeDefinition[]
  filter: FilterGroupType
}

//TODO: Remove this once we know how we want groups to look
const withRemoveButton = (Component: any) => {
  return (props: any) => {
    return typeof props.onRemove === 'function' ? (
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <Box style={{ margin: 10 }}>
          <Fab onClick={() => props.onRemove()} size="small" color="secondary">
            <Remove />
          </Fab>
        </Box>
        <Component {...props} />
      </Box>
    ) : (
      <Component {...props} />
    )
  }
}

const withDivider = (Component: any) => {
  return (props: any) => (
    <Box style={{ display: 'flex' }}>
      <Box>
        <Divider />
      </Box>
      <Component {...props} />
    </Box>
  )
}

const Divider = () => (
  <Box
    style={{
      height: '100%',
      width: 12,
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      float: 'left',
      borderRadius: '14px',
      marginRight: 10,
    }}
  />
)

const FilterGroup = withRemoveButton(
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
  const { filter } = props
  return (
    <Box display="flex">
      <Operator
        onChange={(value: string) => {
          props.onChange({ ...filter, type: value })
        }}
        value={filter.type}
      />
      <Button
        onClick={() => {
          const filters = filter.filters.slice()
          filters.push({ ...defaultFilter })
          props.onChange({ ...filter, filters })
        }}
        style={filterHeaderButtonStyle}
        variant="outlined"
        startIcon={<Add fontSize="small" />}
      >
        <Typography noWrap>Add Field</Typography>
      </Button>
      {(props.limitDepth === undefined || props.limitDepth !== 0) && (
        <Button
          style={filterHeaderButtonStyle}
          onClick={() => {
            const filters = filter.filters.slice()
            filters.push({ type: 'AND', filters: [{ ...defaultFilter }] })
            props.onChange({ ...filter, filters })
          }}
          variant="outlined"
          startIcon={<Add fontSize="small" />}
        >
          <Typography noWrap>Add Group</Typography>
        </Button>
      )}
    </Box>
  )
}

const FilterList = (props: FilterGroupProps) => {
  const { filter } = props
  return (
    <Box>
      {filter.filters.map((subfilter, i) => {
        const onChange = (value: FilterGroupType | QueryFilter) => {
          const filters = filter.filters.slice()
          filters[i] = value
          props.onChange({ ...filter, filters })
        }
        const onRemove = () => {
          const filters = filter.filters.slice()
          filters.splice(i, 1)
          props.onChange({
            ...filter,
            filters,
          })
        }
        if (isFilterGroup(subfilter)) {
          return (
            <Box key={i} style={{ margin: 10, marginLeft: 0 }}>
              <FilterGroup
                limitDepth={
                  props.limitDepth !== undefined
                    ? props.limitDepth - 1
                    : undefined
                }
                filter={subfilter}
                editing={props.editing}
                onChange={onChange}
                onRemove={onRemove}
                attributeDefinitions={props.attributeDefinitions}
              />
            </Box>
          )
        } else {
          return (
            <Box key={i} style={{ margin: 10, marginLeft: 0 }}>
              <IndividualFilter
                filter={subfilter}
                editing={props.editing}
                onChange={onChange}
                onRemove={onRemove}
                attributeDefinitions={props.attributeDefinitions}
              />
            </Box>
          )
        }
      })}
    </Box>
  )
}

export default FilterGroup
