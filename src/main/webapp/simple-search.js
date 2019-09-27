import React, { useState } from 'react'

import { BasicSearch } from './basic-search'
import Results from './results/results'
import QueryStatus from './query-status'

import Typography from '@material-ui/core/Typography'

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

const SimpleSearch = props => {
  const [query, setQuery] = useState(undefined)

  const { results = [], isPending, onSearch, onClear, onCancel } = props

  return (
    <div style={{ margin: '0 auto', padding: 20 }}>
      <Typography variant="h4" style={{ marginBottom: 20 }}>
        Simple Search
      </Typography>
      <div style={{ display: 'flex', overflow: 'hidden', padding: 1 }}>
        <div style={{ width: 360, minWidth: 360 }}>
          <BasicSearch
            onSearch={query => {
              setQuery(query)
              onClear(queryId)
              onSearch(query)
            }}
          />
          <QueryStatus
            sources={props.status}
            onRun={srcs => {
              onSearch({ ...query, srcs })
            }}
            onCancel={srcs => {
              onCancel(queryId, srcs)
            }}
          />
        </div>
        <div style={{ minWidth: 20 }} />
        <div style={{ flex: '1 1', overflow: 'auto', padding: 1 }}>
          <Results
            results={results}
            attributes={['title', /*'thumbnail',*/ 'created']}
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
