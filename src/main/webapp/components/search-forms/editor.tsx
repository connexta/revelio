import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import React, { useState } from 'react'
import { AttributeDefinition, QueryType } from '../query-builder/types'
import TextField from '@material-ui/core/TextField'
const { useQueryExecutor, useApolloFallback } = require('../../react-hooks')
import { set } from 'immutable'

const genResults = require('../../sample-data/gen-results').default
import loadable from 'react-loadable'
import LinearProgress from '@material-ui/core/LinearProgress'
let Visualizations: any = () => null
if (typeof window !== 'undefined') {
  Visualizations = loadable({
    loader: async () =>
      await import(//prettier-ignore
      //@ts-ignore
      /* webpackChunkName: "visualizations" */ '../visualizations').then(
        module => module.default
      ),
    loading: () => <LinearProgress />,
  })
}

type HeaderProps = {
  query?: QueryType
  addOptionsRef?: (el: HTMLDivElement) => void
  onChange: (query: QueryType) => void
}

const Header = (props: HeaderProps) => {
  const { query = {} } = props
  return (
    <Box display="flex" style={{ padding: 8 }} alignItems="center">
      <TextField
        fullWidth
        value={query.title || ''}
        variant="outlined"
        label="Search Title"
        onChange={event => {
          props.onChange(set(query, 'title', event.target.value))
        }}
        autoFocus
      />
      <div style={{ marginLeft: 10 }} ref={props.addOptionsRef} />
    </Box>
  )
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
          Save Search Form
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
  onSearch: (query: QueryType) => void
  queryBuilder: React.FunctionComponent<{
    query?: QueryType
    onChange: (query: QueryType) => void
    addOptionsRef?: HTMLDivElement
  }>
  onChange: (query: QueryType) => void
  results?: Array<any>
}

const queryToSearch = (query: QueryType) => {
  const { sources, sorts, detail_level, filterTree } = query
  return {
    filterTree,
    sourceIds: sources,
    sortPolicy: (sorts || []).map(sort => {
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

  const [addOptionsRef, setAddOptionsRef] = React.useState<HTMLDivElement>()

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
        <Box style={{ height: `calc(100% - 134px)`, width: 500 }}>
          <Header
            query={query}
            addOptionsRef={el => setAddOptionsRef(el)}
            onChange={props.onChange}
          />
          <Divider />
          <QueryBuilder
            query={query}
            onChange={props.onChange}
            addOptionsRef={addOptionsRef}
          />
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
