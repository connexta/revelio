import React, { useState } from 'react'
import Filter, { QueryFilter } from '../query-filters/filter/individual-filter'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'

import loadable from 'react-loadable'
import Button from '@material-ui/core/Button'
import { SearchFormType } from '.'
import { FilterGroupType } from '../query-filters/filter/filter-group'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import useAttributeDefinitions from '../react-hooks/use-attribute-definitions'
import {
  AttributeDefinition,
  sampleAttributeDefinitions,
} from '../query-filters/filter/dummyDefinitions'
import { defaultFilter } from '../query-filters/filter/filter-utils'
import QuerySettings, { QuerySettingsType } from './query-settings'
import Menu from '@material-ui/core/Menu'
import useAnchorEl from '../react-hooks/use-anchor-el'
import MenuItem from '@material-ui/core/MenuItem'

const { useQueryExecutor, useApolloFallback } = require('../react-hooks')
const genResults = require('../gen-results').default

const Loading = () => {
  return (
    <Paper>
      <LinearProgress />
    </Paper>
  )
}
const Error = (props: any) => {
  return (
    <Paper>
      <Typography>
        {props.message ? props.message : 'Something went wrong'}
      </Typography>
    </Paper>
  )
}

let Visualizations: any = () => null

if (typeof window !== 'undefined') {
  Visualizations = loadable({
    loader: () =>
      import(//prettier-ignore
      // @ts-ignore
      /* webpackChunkName: "visualizations" */ '../workspaces/visualizations').then(
        module => module.default
      ),
    loading: Loading,
  })
}

type QueryBuilderProps = {
  attributeDefinitions?: AttributeDefinition[]
  onCancel?: () => void
  onSave?: (form: SearchFormType) => void
  onSearch?: (query: any) => void
  form?: SearchFormType
}

const getFilterTree = (form: SearchFormType) => {
  if (!form.filterTree) {
    return {
      type: 'AND',
      filters: [{ ...defaultFilter }],
    }
  }

  if (!form.filterTree.filters) {
    return { type: 'AND', filters: [{ ...form.filterTree }] }
  }
  return { ...form.filterTree }
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
  const { form = {} } = props
  const [filterTree, setFilterTree] = useState<FilterGroupType>(
    getFilterTree(form)
  )
  const [title, setTitle] = useState(form.title || 'New Search')

  const [querySettings, setQuerySettings] = useState<QuerySettingsType>({
    sources: form.sources || undefined,
    sorts: form.sorts || undefined,
    detail_level: form.detail_level || undefined,
  })

  const { attributeDefinitions = sampleAttributeDefinitions } = props

  const addFilter = () => {
    setFilterTree({
      ...filterTree,
      filters: [
        { property: 'anyText', type: 'ILIKE', value: '' },
        ...filterTree.filters,
      ],
    })
  }

  const addSources = () => {
    if (querySettings.sources === undefined) {
      setQuerySettings({ ...querySettings, sources: [] })
    }
  }

  const addSorts = () => {
    if (querySettings.sorts === undefined) {
      setQuerySettings({ ...querySettings, sorts: [] })
    }
  }

  const addResultForm = () => {
    if (querySettings.detail_level === undefined) {
      setQuerySettings({ ...querySettings, detail_level: null })
    }
  }

  const options = {
    'Field Filter': addFilter,
    Sources: addSources,
    'Sort Order': addSorts,
    'Result Form': addResultForm,
  }

  return (
    <Box>
      <Box
        style={{
          width: 500,
          overflow: 'auto',
          height: `calc(100% - 60px)`,
          padding: '8px 0px',
        }}
        display="flex"
        flexDirection="column"
      >
        <Box display="flex" style={{ padding: 8 }} alignItems="center">
          <TextField
            fullWidth
            value={form.title}
            variant="outlined"
            label="Search Title"
            onChange={event => {
              setTitle(event.target.value)
            }}
            autoFocus
          />
          <AddButton options={options} />
        </Box>
        <Divider />
        {filterTree.filters.map((filter: QueryFilter, i) => (
          <Box key={i} style={{ padding: '0px 16px' }}>
            <Filter
              filter={filter}
              onChange={(newFilter: any) => {
                const filters = filterTree.filters.slice()
                filters[i] = newFilter
                setFilterTree({ ...filterTree, filters })
              }}
              onRemove={() => {
                const filters = filterTree.filters.slice()
                filters.splice(i, 1)
                setFilterTree({ ...filterTree, filters })
              }}
              attributeDefinitions={attributeDefinitions}
            />
          </Box>
        ))}
        <QuerySettings settings={querySettings} onChange={setQuerySettings} />
      </Box>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: 'auto 5px',
        }}
      >
        {props.onSearch && (
          <React.Fragment>
            <Button
              variant="outlined"
              color="secondary"
              endIcon={<PlayCircleFilledIcon />}
              onClick={() => {
                if (props.onSearch) {
                  const {
                    sources: srcs,
                    sorts = [],
                    detail_level,
                  } = querySettings
                  props.onSearch({
                    filterTree,
                    srcs: srcs || ['ddf.distribution'],
                    sorts: sorts.map(sort => {
                      const splitIndex = sort.lastIndexOf(',')
                      return {
                        attribute: sort.substring(0, splitIndex),
                        direction: sort.substring(splitIndex + 1, sort.length),
                      }
                    }),
                    detail_level,
                  })
                }
              }}
            >
              Test Search
            </Button>
            <Box style={{ width: 10, display: 'inline-block' }} />
          </React.Fragment>
        )}
        <Button
          onClick={() => {
            if (props.onCancel) {
              props.onCancel()
            }
          }}
          variant="outlined"
          color="secondary"
        >
          Cancel
        </Button>
        <Box style={{ width: 10, display: 'inline-block' }} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (props.onSave) {
              props.onSave({
                filterTree,
                title,
                id: form.id,
                ...querySettings,
                detail_level: querySettings.detail_level || undefined,
              })
            }
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

type EditorProps = QueryBuilderProps & {
  results?: Array<any>
}

export const SearchFormEditor = (props: EditorProps) => {
  return (
    <Box width="100%" display="flex" flexDirection="column" height="100%">
      <Typography
        variant="h4"
        component="h1"
        style={{ padding: 20 }}
        color="textPrimary"
      >
        Search Form Editor
      </Typography>
      <Divider />
      <Box width="100%" display="flex" flexDirection="row" height="100%">
        <QueryBuilder {...props} onSearch={props.onSearch} />
        <Paper style={{ width: `calc(100% - 500px)`, height: '100%' }}>
          <Box style={{ width: '100%', height: '100%' }}>
            <Visualizations results={props.results || []} />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

const MetacardTypesContainer = (props: EditorProps) => {
  const { loading, error, attributeDefinitions } = useAttributeDefinitions()
  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} />
  }

  return (
    <SearchFormEditor {...props} attributeDefinitions={attributeDefinitions} />
  )
}

const useDummyExecutor = () => {
  const [results, setResults] = useState([])
  const onSearch = () => {
    setResults(genResults())
  }
  return { results, onSearch }
}

export default (props: any) => {
  const fn = useApolloFallback(useQueryExecutor, useDummyExecutor)
  const { results, onSearch } = fn()
  const Component = useApolloFallback(MetacardTypesContainer, SearchFormEditor)
  return <Component {...props} results={results} onSearch={onSearch} />
}
