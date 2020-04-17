import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { merge, set } from 'immutable'
import React, { useEffect, useRef, useState, useContext } from 'react'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import {
  Actions,
  DeleteAction,
  EditAction,
  IndexCardItem,
} from '../index-cards'
import { MetacardInteractionsDropdown } from '../index-cards/metacard-interactions'
import { QueryType } from '../query-builder/types'
import { WorkspaceContext } from '../workspace/workspace-context'
import AddQuery from './add-query'
import QueryEditorPopover from './query-editor-popover'
import { QueryCardProps, QueryManagerProps, QuerySelectorProps } from './types'
const { useDrawInterface } = require('../../react-hooks')
const {
  ExportMetacardInteraction,
  CompressedExportMetacardInteraction,
} = require('../result-export/result-export-action')

const QueryCard = (props: QueryCardProps) => {
  const { onSearch, query = {} } = props
  const [anchorEl, handleOpen, handleClose] = useAnchorEl()
  const [{ active: isDrawing }] = useDrawInterface()
  const [wasDrawing, setWasDrawing] = useState(false)
  const drawAnchorEl = useRef(null)
  const attributes = useContext(WorkspaceContext)

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
        onClick={onSearch}
      >
        <Actions attributes={attributes}>
          <EditAction onEdit={handleOpen} />
          <DeleteAction />
          <MetacardInteractionsDropdown>
            <CompressedExportMetacardInteraction
              resultsToExport={props.resultsToExport}
              zipped={true}
            />
            <ExportMetacardInteraction
              resultsToExport={props.resultsToExport}
            />
          </MetacardInteractionsDropdown>
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
  const { queries, currentQuery, onSearch } = props
  const hasQueries = queries && queries.length > 0
  const [anchorEl, handleOpen, handleClose, open] = useAnchorEl()

  const queryCards = queries.map(query => (
    <QueryCard
      {...props}
      query={query}
      key={query.id}
      onSearch={() => onSearch(query.id!)}
    />
  ))

  return hasQueries ? (
    <div style={{ display: 'flex' }}>
      <QueryCard
        {...props}
        query={queries.find(query => query.id === currentQuery)}
        onSearch={() => onSearch(currentQuery)}
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
  const { queries } = props

  const onChange = (query: QueryType) => {
    const index = queries.findIndex(q => q.id === query.id)
    const updatedQueries =
      index !== -1 ? set(queries, index, query) : merge([query], queries)
    props.onChange(updatedQueries)
  }

  const onSearch = (id: string) => {
    props.onSave(id)
    props.onSearch(id)
  }

  return (
    <React.Fragment>
      <AddQuery {...props} onChange={onChange} />
      <QuerySelector {...props} onChange={onChange} onSearch={onSearch} />
    </React.Fragment>
  )
}
export default QueryManager
