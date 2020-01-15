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

const { useQueryExecutor, useApolloFallback } = require('../react-hooks')
const genResults = require('../gen-results').default
const { SourcesSelect } = require('../sources')
const { FilterCard } = require('../basic-search')
const SortOrder = require('../sort-order').default

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

const getSorts = (sorts: string[]) => {
  return sorts.map(sort => {
    const splitIndex = sort.lastIndexOf(',')
    return {
      attribute: sort.substring(0, splitIndex),
      direction: sort.substring(splitIndex + 1, sort.length),
    }
  })
}

const QueryBuilder = (props: QueryBuilderProps) => {
  const { form = {} } = props
  const [filterTree, setFilterTree] = useState<FilterGroupType>(
    getFilterTree(form)
  )
  const [title, setTitle] = useState(form.title || 'New Search')

  const [sources, setSources] = useState(form.sources || ['ddf.distribution'])

  const [sorts, setSorts] = useState(getSorts(form.sorts || []))

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
          <Button
            variant="outlined"
            style={{ marginLeft: 10 }}
            onClick={addFilter}
          >
            Add Field
          </Button>
        </Box>
        <Divider />
        <Typography
          variant="h6"
          component="h1"
          style={{
            padding: 5,
            margin: '0px auto',
            height: 'fit-content',
            paddingBottom: 0,
          }}
          color="textPrimary"
        >
          Search Criteria
        </Typography>
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
        <Divider style={{ margin: '10px 0px' }} />
        <Typography
          variant="h6"
          component="h1"
          style={{ padding: 5, margin: '0px auto', height: 'fit-content' }}
          color="textPrimary"
        >
          Search Settings
        </Typography>
        <Box style={{ padding: '0px 16px' }}>
          <FilterCard label="Sources">
            <SourcesSelect
              value={sources}
              sources={['ddf.distribution']}
              onChange={setSources}
            />
          </FilterCard>
        </Box>
        <Box style={{ padding: '0px 16px' }}>
          <FilterCard label="Sorts">
            <SortOrder value={sorts} onChange={setSorts} />
          </FilterCard>
        </Box>
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
                  props.onSearch({ filterTree, srcs: ['ddf.distribution'] })
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
                sorts: sorts.map(sort => `${sort.attribute},${sort.direction}`),
                sources,
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
