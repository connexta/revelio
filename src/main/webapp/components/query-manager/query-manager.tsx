import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { merge, set } from 'immutable'
import React, { useEffect, useRef, useState } from 'react'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import {
  Actions,
  DeleteAction,
  EditAction,
  IndexCardItem,
} from '../index-cards'
import { QueryType } from '../query-builder/types'
import AddQuery from './add-query'
import QueryEditorPopover from './query-editor-popover'
import { QueryCardProps, QueryManagerProps, QuerySelectorProps } from './types'
const { useDrawInterface } = require('../../react-hooks')

const QueryCard = (props: QueryCardProps) => {
  const { onSearch, query = {} } = props
  const [anchorEl, handleOpen, handleClose] = useAnchorEl()
  const [{ active: isDrawing }] = useDrawInterface()
  const [wasDrawing, setWasDrawing] = useState(false)
  const drawAnchorEl = useRef(null)

  useEffect(
    () => {
      if (isDrawing) {
        setWasDrawing(true)
        handleClose()
      }
      if (!isDrawing && wasDrawing) {
        handleOpen({
          currentTarget: drawAnchorEl.current,
        })
      }
    },
    [isDrawing]
  )

  return (
    <React.Fragment>
      <div ref={drawAnchorEl} />
      <IndexCardItem
        title={query.title}
        subHeader={'Has not been run'}
        onClick={() => onSearch(query)}
      >
        <Actions>
          <EditAction onEdit={handleOpen} />
          <DeleteAction />
        </Actions>
      </IndexCardItem>
      <QueryEditorPopover
        {...props}
        anchorEl={anchorEl}
        onClose={() => {
          setWasDrawing(isDrawing)
          handleClose()
        }}
      />
    </React.Fragment>
  )
}

const QuerySelector = (props: QuerySelectorProps) => {
  const { queries, currentQuery } = props
  const hasQueries = queries && queries.length > 0
  const [anchorEl, handleOpen, handleClose, open] = useAnchorEl()

  const queryCards = queries.map(query => (
    <QueryCard {...props} query={query} key={query.id} />
  ))

  return hasQueries ? (
    <div style={{ display: 'flex' }}>
      <QueryCard
        {...props}
        query={queries.find(query => query.id === currentQuery)}
      />
      <Button
        color="primary"
        variant="contained"
        style={{ marginTop: 20, marginBottom: 20, marginRight: 20 }}
        onClick={handleOpen}
      >
        <ExpandMoreIcon />
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {queryCards}
      </Popover>
    </div>
  ) : null
}

const QueryManager = (props: QueryManagerProps) => {
  const { queries, QueryEditor, onSearch } = props

  const onChange = (query: QueryType) => {
    const index = queries.findIndex(q => q.id === query.id)
    const updatedQueries =
      index !== -1 ? set(queries, index, query) : merge([query], queries)
    props.onChange(updatedQueries)
  }
  const hasQueries = queries && queries.length > 0

  return (
    <React.Fragment>
      <AddQuery
        onSearch={query => {
          onChange(query)
          onSearch(query)
        }}
        QueryEditor={QueryEditor}
        hasQueries={hasQueries}
      />
      <QuerySelector {...props} onChange={onChange} />
    </React.Fragment>
  )
}
export default QueryManager
