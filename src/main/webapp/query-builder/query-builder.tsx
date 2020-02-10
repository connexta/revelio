import * as React from 'react'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import { getIn, setIn } from 'immutable'
import useAnchorEl from '../react-hooks/use-anchor-el'
import { defaultFilter } from './filter/filter-utils'
import Filter from './filter/individual-filter'
import QuerySettings from './query-settings'
import { AttributeDefinition, QueryFilter, QueryType } from './types'

export type QueryBuilderProps = {
  attributeDefinitions?: AttributeDefinition[]
  onChange: (query: QueryType) => void
  query?: QueryType
}

const AddButton = (props: { options: any }) => {
  const [anchorEl, open, close] = useAnchorEl()
  return (
    <React.Fragment>
      <Button variant="outlined" style={{ marginLeft: 10 }} onClick={open}>
        Add Option
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={close}>
        {Object.keys(props.options).map(option => {
          return (
            <MenuItem
              key={option}
              onClick={() => {
                props.options[option]()
                close()
              }}
            >
              {option}
            </MenuItem>
          )
        })}
      </Menu>
    </React.Fragment>
  )
}

const QueryBuilder = (props: QueryBuilderProps) => {
  const { query = {} } = props
  const {
    title,
    filterTree = { type: 'AND', filters: [] },
    ...querySettings
  } = query

  const addFilter = () => {
    const currentFilters = getIn(filterTree, ['filters'], [])
    let newFilterTree = { ...filterTree }
    newFilterTree = setIn(
      newFilterTree,
      ['filters'],
      [{ ...defaultFilter }, ...currentFilters]
    )
    props.onChange(setIn(query, ['filterTree'], newFilterTree))
  }

  const addSources = () => {
    if (querySettings.sources == undefined) {
      props.onChange({
        ...query,
        sources: [],
      })
    }
  }

  const addSorts = () => {
    if (querySettings.sorts == undefined) {
      props.onChange({
        ...query,
        sorts: [],
      })
    }
  }

  const addResultForm = () => {
    if (querySettings.detail_level == undefined) {
      props.onChange({ ...query, detail_level: 'All Fields' })
    }
  }

  const options = {
    'Field Filter': addFilter,
    Sources: addSources,
    'Sort Order': addSorts,
    'Result Form': addResultForm,
  }

  const filters = getIn(filterTree, ['filters'], [])

  return (
    <Box
      style={{
        width: '100%',
        overflow: 'auto',
        height: '100%',
        padding: '8px 0px',
        boxSizing: 'border-box',
      }}
      display="flex"
      flexDirection="column"
    >
      <Box display="flex" style={{ padding: 8 }} alignItems="center">
        <TextField
          fullWidth
          value={query.title}
          variant="outlined"
          label="Search Title"
          onChange={event => {
            props.onChange(setIn(query, ['title'], event.target.value))
          }}
          autoFocus
        />
        <AddButton options={options} />
      </Box>
      <Divider />
      {filters.map((filter: QueryFilter, i: number) => (
        <Box key={i} style={{ padding: '0px 16px' }}>
          <Filter
            filter={filter}
            onChange={(newFilter: any) => {
              const filters = filterTree.filters.slice()
              filters[i] = newFilter
              props.onChange(setIn(query, ['filterTree', 'filters'], filters))
            }}
            onRemove={() => {
              const filters = filterTree.filters.slice()
              filters.splice(i, 1)
              props.onChange(setIn(query, ['filterTree', 'filters'], filters))
            }}
          />
        </Box>
      ))}
      <QuerySettings
        settings={querySettings}
        onChange={newSettings => {
          props.onChange({ filterTree, title, ...newSettings })
        }}
      />
    </Box>
  )
}

export default QueryBuilder
