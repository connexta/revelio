import React, { useState } from 'react'

import { BasicSearch } from './basic-search'
import ResultTable from './results/results'
import QueryStatus from './query-status'

import Typography from '@material-ui/core/Typography'
import TablePagination from '@material-ui/core/TablePagination'

import {
  executeQuery,
  clearQuery,
  cancelQuery,
  getQueryStatus,
  getQueryResponse,
  isQueryPending,
} from './intrigue-api/lib/cache'

import { connect } from 'react-redux'

const queryId = '313a84858daa4ef5980d4b11a745d6d3'

const mapStateToProps = state => {
  const results = getQueryResponse(queryId)(state)
  const status = getQueryStatus(queryId)(state)
  const isPending = isQueryPending(queryId)(state)
  return { results, isPending, status, sources: ['ddf.distribution'] }
}

const mapDispatchToProps = {
  onSearch: executeQuery,
  onClear: clearQuery,
  onCancel: cancelQuery,
}

const getPageWindow = (data, pageIndex, pageSize) => {
  const i = pageIndex * pageSize
  const j = i + pageSize
  return data.slice(i, j)
}

const SimpleSearch = props => {
  const [query, setQuery] = useState(undefined)
  const { results = [], onSearch, onClear, onCancel } = props

  const [pageSize, setPageSize] = useState(10)
  const [pageIndex, setPageIndex] = useState(0)
  const page = getPageWindow(results, pageIndex, pageSize)

  return (
    <div
      style={{
        margin: '0 auto',
        padding: 20,
        boxSizing: 'border-box',
        height: 'calc(100% - 64px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" style={{ marginBottom: 20 }}>
        Simple Search
      </Typography>
      <div
        style={{
          display: 'flex',
          overflow: 'hidden',
          padding: 1,
          boxSizing: 'border-box',
          flex: '1',
        }}
      >
        <div style={{ width: 360, minWidth: 360 }}>
          <BasicSearch
            onSearch={query => {
              setPageIndex(0)
              setQuery(query)
              onClear(queryId)
              onSearch(query)
            }}
          />
          <QueryStatus
            sources={props.status}
            onRun={srcs => {
              setPageIndex(0)
              onSearch({ ...query, srcs })
            }}
            onCancel={srcs => {
              srcs.forEach(src => {
                onCancel(queryId, src)
              })
            }}
          />
        </div>
        <div style={{ minWidth: 20 }} />
        <div
          style={{
            display: 'flex',
            flex: '1',
            flexDirection: 'column',
          }}
        >
          <ResultTable
            results={page}
            attributes={['title', /*'thumbnail',*/ 'created']}
          />
          <TablePagination
            count={results.length}
            page={pageIndex}
            component="div"
            rowsPerPage={pageSize}
            onChangePage={(_, n) => {
              setPageIndex(n)
            }}
            onChangeRowsPerPage={e => {
              setPageIndex(0)
              setPageSize(e.target.value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleSearch)
