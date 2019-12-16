import React, { useState } from 'react'
import Filter from '../query-filters/filter'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'

import loadable from 'react-loadable'
import { memo } from 'react'
import Button from '@material-ui/core/Button'
import { SearchFormType } from '.'
import { FilterGroupType } from '../query-filters/filter/filter-group'
const { useQueryExecutor, useApolloFallback } = require('../react-hooks')

let MemoizedVisualizations: any = () => null
if (typeof window !== 'undefined') {
  MemoizedVisualizations = loadable({
    loader: () =>
      import(//prettier-ignore
      // @ts-ignore
      /* webpackChunkName: "visualizations" */ '../workspaces/visualizations').then(
        module => memo(module.default)
      ),
    loading: () => null,
  })
}

type QueryBuilderProps = SearchFormType & {
  onCancel?: () => void
  onSave?: (form: SearchFormType) => void
  onSearch?: (query: any) => void
}

const getFilterTree = (props: QueryBuilderProps) => {
  if (!props.filterTree) {
    return {
      type: 'AND',
      filters: [{ property: 'anyText', type: 'ILIKE', value: '' }],
    }
  }

  if (!props.filterTree.filters) {
    return { type: 'AND', filters: [{ ...props.filterTree }] }
  }
  return { ...props.filterTree }
}
const QueryBuilder = (props: QueryBuilderProps) => {
  const [filterTree, setFilterTree] = useState<FilterGroupType>(
    getFilterTree(props)
  )
  const [title, setTitle] = useState(props.title || '')

  return (
    <Box>
      <Box
        style={{
          width: 500,
          overflow: 'auto',
          height: `calc(100% - 50px)`,
        }}
        display="flex"
        flexDirection="column"
      >
        <TextField
          InputProps={{ style: { fontSize: 30 } }}
          fullWidth
          placeholder="Search Title"
          value={title}
          onChange={event => {
            setTitle(event.target.value)
          }}
        />
        <Divider />
        <Filter {...filterTree} onChange={setFilterTree} limitDepth={0} />
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'flex-end', margin: 5 }}>
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
    <Box
      width="100%"
      display="flex"
      flexDirection="row"
      height={`calc(100vh - 128px)`}
    >
      <QueryBuilder {...props} onSearch={props.onSearch} />
      <Paper style={{ width: `calc(100% - 500px)`, height: '100%' }}>
        <Box style={{ width: '100%', height: '100%' }}>
          <MemoizedVisualizations results={props.results || []} />
        </Box>
      </Paper>
    </Box>
  )
}

const fallbackFn = () => ({
  results: [],
  onSearch: () => {},
})

export default (props: any) => {
  const fn = useApolloFallback(useQueryExecutor, fallbackFn)
  const { results, onSearch } = fn()

  return <SearchFormEditor {...props} results={results} onSearch={onSearch} />
}
