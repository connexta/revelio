import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import React from 'react'
import { AttributeDefinition, QueryType } from '../query-builder/types'

type FooterProps = {
  onSearch: () => void
  onSave?: () => void
}

const Footer = (props: FooterProps) => {
  return (
    <Box display="flex" height="100%">
      {props.onSave && (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={props.onSave}
        >
          Save
        </Button>
      )}
      <Box style={{ width: 10, display: 'inline-block' }} />
      {props.onSearch && (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={props.onSearch}
        >
          Search
        </Button>
      )}
    </Box>
  )
}

type EditorProps = {
  attributeDefinitions?: AttributeDefinition[]
  query?: QueryType
  onSave: (query: QueryType) => void
  onSearch: (query: any) => void
  queryBuilder: React.FunctionComponent<{
    query?: QueryType
    onChange: (query: QueryType) => void
  }>
  onChange: (query: QueryType) => void
}

const queryToSearch = (query: QueryType) => {
  const { sources, sorts, detail_level, filterTree } = query
  return {
    filterTree,
    sourceIds: sources || ['ddf.distribution'],
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

export default (props: EditorProps) => {
  const query = props.query || {}
  const QueryBuilder = props.queryBuilder
  const onSearch = () => {
    props.onSearch(queryToSearch(query))
  }

  return (
    <Box width="100%" display="flex" flexDirection="column" height="100%">
      <QueryBuilder query={query} onChange={props.onChange} />
      <Box
        width="100%"
        style={{
          marginTop: '10px',
        }}
      >
        <Footer
          onSave={() => {
            props.onSave(query)
          }}
          onSearch={onSearch}
        />
      </Box>
    </Box>
  )
}
