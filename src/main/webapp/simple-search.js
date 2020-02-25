import React, { useState } from 'react'

import BasicSearch from './components/basic-search'
import ResultTable from './results/results'
import QueryStatus from './query-status'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'

import Typography from '@material-ui/core/Typography'
import TablePagination from '@material-ui/core/TablePagination'

import Inspector from './inspector'

import { useSelectionInterface, useQueryExecutor } from './react-hooks'

const getPageWindow = (data, pageIndex, pageSize) => {
  const i = pageIndex * pageSize
  const j = i + pageSize
  return data.slice(i, j)
}

const SimpleSearch = props => {
  const [query, setQuery] = useState(undefined)
  const {
    results,
    status,
    onSearch,
    onCancel,
    onClear,
    selectedResults,
  } = props

  const [pageSize, setPageSize] = useState(10)
  const [pageIndex, setPageIndex] = useState(0)
  const page = getPageWindow(results, pageIndex, pageSize)

  const [showInspector, setShowInspector] = useState(false)
  const onInspect = () => {
    setShowInspector(true)
  }

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
              onClear()
              onSearch(query)
            }}
          />
          <QueryStatus
            sources={status}
            onRun={srcs => {
              setPageIndex(0)
              onSearch({ ...query, srcs })
            }}
            onCancel={srcs => {
              srcs.forEach(src => {
                onCancel(src)
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
          <div style={{ marginBottom: 10, textAlign: 'right' }}>
            <Button variant="outlined" onClick={onInspect}>
              Open Inspector
            </Button>
          </div>

          {showInspector ? (
            <Dialog
              open
              onClose={() => {
                setShowInspector(false)
              }}
            >
              <Inspector results={selectedResults} />
            </Dialog>
          ) : null}
          <ResultTable
            results={page}
            attributes={['title', 'thumbnail', 'created']}
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

const Container = () => {
  const [selected] = useSelectionInterface()

  const { results, status, onSearch, onCancel, onClear } = useQueryExecutor()

  const selectedResults = results.filter(result => {
    return selected.has(result.metacard.attributes.id)
  })

  return (
    <SimpleSearch
      results={results}
      status={status}
      onSearch={onSearch}
      onCancel={onCancel}
      onClear={onClear}
      selectedResults={selectedResults}
    />
  )
}

export default Container
