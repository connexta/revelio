import React from 'react'

import BasicSearch from './basic-search'
import Results from './results/results'
import Typography from '@material-ui/core/Typography'

import { getQueryResponse } from './intrigue-api/lib/cache'

import { connect } from 'react-redux'

const mapStateToProps = state => {
  const queryId = '313a84858daa4ef5980d4b11a745d6d3'
  const results = getQueryResponse(queryId)(state)
  return { results }
}

const Table = connect(mapStateToProps)(Results)

const SimpleSearch = () => {
  return (
    <div style={{ margin: '0 auto', padding: 20 }}>
      <Typography variant="h4" style={{ marginBottom: 20 }}>
        Simple Search
      </Typography>
      <div style={{ display: 'flex', overflow: 'hidden', padding: 1 }}>
        <div style={{ width: 360, minWidth: 360 }}>
          <BasicSearch />
        </div>
        <div style={{ minWidth: 20 }} />
        <div style={{ flex: '1 1', overflow: 'auto', padding: 1 }}>
          <Table
            results={[]}
            attributes={['title', 'thumbnail', 'location', 'created']}
          />
        </div>
      </div>
    </div>
  )
}

export default SimpleSearch
