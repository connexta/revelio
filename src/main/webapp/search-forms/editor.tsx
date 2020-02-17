import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import React, { useState } from 'react'
import loadable from 'react-loadable'
import { AttributeDefinition, QueryType } from '../query-builder/types'
const { useQueryExecutor, useApolloFallback } = require('../react-hooks')
const genResults = require('../gen-results').default

const Loading = () => {
  return (
    <Paper>
      <LinearProgress />
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
        module => React.memo(module.default) // React.memo prevents the map from re-rendering when parent does
      ),
    loading: Loading,
  })
}

type FooterProps = {
  onSearch: () => void
  onCancel: () => void
  onSave: () => void
}

const Footer = (props: FooterProps) => {
  return (
    <Box display="flex" justifyContent="flex-end" height="100%">
      <Box
        style={{
          margin: 'auto 5px',
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          endIcon={<PlayCircleFilledIcon />}
          onClick={props.onSearch}
        >
          Test Search
        </Button>
        <Box style={{ width: 10, display: 'inline-block' }} />

        <Button onClick={props.onCancel} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Box style={{ width: 10, display: 'inline-block' }} />
        <Button variant="contained" color="primary" onClick={props.onSave}>
          Save
        </Button>
      </Box>
    </Box>
  )
}

type EditorProps = {
  attributeDefinitions?: AttributeDefinition[]
  title?: String
  query?: QueryType
  onCancel: () => void
  onSave: (query: QueryType) => void
  onSearch: (query: any) => void
  queryBuilder: React.FunctionComponent<{
    query?: QueryType
    onChange: (query: QueryType) => void
  }>
  onChange: (query: QueryType) => void
  results?: Array<any>
}

const queryToSearch = (query: QueryType) => {
  const { sourceIds, sortPolicy, detail_level, filterTree } = query
  return {
    filterTree,
    srcs: sourceIds || ['ddf.distribution'],
    sortPolicy: (sortPolicy || []).map(sort => {
      //query builder might have sorts in the correct format already
      if (typeof sort !== 'string') {
        return sort
      }
      const splitIndex = sort.lastIndexOf(',')
      return {
        propertyName: sort.substring(0, splitIndex),
        sortOrder: sort.substring(splitIndex + 1, sort.length),
      }
    }),
    detail_level: detail_level === 'All Fields' ? undefined : detail_level,
  }
}

export const QueryEditor = (props: EditorProps) => {
  const query = props.query || {}
  const QueryBuilder = props.queryBuilder
  const onSearch = () => {
    props.onSearch(queryToSearch(query))
  }

  return (
    <Box width="100%" display="flex" flexDirection="column" height="100%">
      <Typography
        variant="h4"
        component="h1"
        style={{ padding: 20 }}
        color="textPrimary"
      >
        {props.title || 'Query Editor'}
      </Typography>
      <Divider />
      <Box width="100%" display="flex" flexDirection="row" height="100%">
        <Box style={{ height: `calc(100% - 60px)`, width: 500 }}>
          <QueryBuilder query={query} onChange={props.onChange} />
          <Divider style={{ marginTop: '5px' }} />
          <Box width="100%" height="50px">
            <Footer
              onSave={() => {
                props.onSave(query)
              }}
              onCancel={props.onCancel}
              onSearch={onSearch}
            />
          </Box>
        </Box>

        <Paper style={{ width: `calc(100% - 500px)`, height: '100%' }}>
          <Box style={{ width: '100%', height: '100%' }}>
            <Visualizations results={props.results || []} />
          </Box>
        </Paper>
      </Box>
    </Box>
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
  return <QueryEditor {...props} results={results} onSearch={onSearch} />
}
