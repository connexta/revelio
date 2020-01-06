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

type QueryBuilderProps = SearchFormType & {
  attributeDefinitions?: AttributeDefinition[]
  onCancel?: () => void
  onSave?: (form: SearchFormType) => void
  onSearch?: (query: any) => void
}

const getFilterTree = (props: QueryBuilderProps) => {
  if (!props.filterTree) {
    return {
      type: 'AND',
      filters: [{ ...defaultFilter }],
    }
  }

  if (!props.filterTree.filters) {
    return { type: 'AND', filters: [{ ...props.filterTree }] }
  }
  return { ...props.filterTree }
}

const Header = (props: any) => {
  return (
    <Box display="flex" style={{ padding: 8 }} alignItems="center">
      <TextField
        fullWidth
        value={props.title}
        variant="outlined"
        label="Search Title"
        onChange={event => {
          props.setTitle(event.target.value)
        }}
      />
      <Button style={{ marginLeft: 10 }} onClick={props.addFilter}>
        Add Field
      </Button>
    </Box>
  )
}

const QueryBuilder = (props: QueryBuilderProps) => {
  const [filterTree, setFilterTree] = useState<FilterGroupType>(
    getFilterTree(props)
  )
  const [title, setTitle] = useState(props.title || 'New Search')

  const { attributeDefinitions = sampleAttributeDefinitions } = props

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
        <Header
          title={title}
          setTitle={setTitle}
          addFilter={() => {
            setFilterTree({
              ...filterTree,
              filters: [
                { property: 'anyText', type: 'ILIKE', value: '' },
                ...filterTree.filters,
              ],
            })
          }}
        />
        <Divider />
        {filterTree.filters.map((filter: QueryFilter, i) => (
          <Box key={i} style={{ padding: '0px 16px', width: 425 }}>
            <Filter
              {...filter}
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
              props.onSave({ filterTree, title, id: props.id })
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
    <Box width="100%" display="flex" flexDirection="row" height="100%">
      <QueryBuilder {...props} onSearch={props.onSearch} />
      <Paper style={{ width: `calc(100% - 500px)`, height: '100%' }}>
        <Box style={{ width: '100%', height: '100%' }}>
          <Visualizations results={props.results || []} />
        </Box>
      </Paper>
    </Box>
  )
}

const fallbackFn = () => ({
  results: genResults(),
  onSearch: () => {},
})

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

export default (props: any) => {
  const fn = useApolloFallback(useQueryExecutor, fallbackFn)
  const { results, onSearch } = fn()
  const Component = useApolloFallback(MetacardTypesContainer, SearchFormEditor)
  return <Component {...props} results={results} onSearch={onSearch} />
}
