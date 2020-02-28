import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { set } from 'immutable'
import React, { useEffect, useRef, useState } from 'react'
import {
  Actions,
  DeleteAction,
  EditAction,
  IndexCardItem,
} from '../index-cards'
import AdvancedSearchQueryBuilder from '../query-builder/query-builder'

const { useDrawInterface } = require('../../react-hooks')

const useOpenClose = props => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    if (props.onClose) {
      props.onClose()
    }
  }

  const open = Boolean(anchorEl)
  return [anchorEl, open, handleOpen, handleClose]
}

const QueryCard = props => {
  const { onSearch, QueryEditor, onChange } = props
  const [anchorEl, open, handleOpen, handleClose] = useOpenClose(props)
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
        title={props.query.title}
        subHeader={'Has not been run'}
        onClick={() => onSearch(props.query)}
      >
        <Actions>
          <EditAction onEdit={handleOpen} />
          <DeleteAction />
        </Actions>
      </IndexCardItem>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setWasDrawing(isDrawing)
          handleClose()
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box style={{ margin: '10px' }}>
          <QueryEditor
            query={props.query}
            queryBuilder={AdvancedSearchQueryBuilder}
            onSearch={query => onSearch({ ...props.query, ...query })}
            onChange={query => onChange({ ...props.query, ...query })}
          />
        </Box>
      </Popover>
    </React.Fragment>
  )
}

const QuerySelector = props => {
  const { queries, currentQuery, QueryEditor, onSearch } = props
  const [anchorEl, open, handleOpen, handleClose] = useOpenClose(props)

  const onChange = query => {
    const updatedQueries = set(
      queries,
      queries.findIndex(q => q.id === query.id),
      query
    )
    props.onChange(updatedQueries)
  }

  const queryCards = queries.map(query => (
    <QueryCard
      key={query.id}
      query={query}
      onSearch={onSearch}
      onChange={onChange}
      QueryEditor={QueryEditor}
    />
  ))

  return (
    <React.Fragment>
      {queries && (
        <div style={{ display: 'flex' }}>
          <QueryCard
            query={queries.find(query => query.id === currentQuery)}
            onSearch={onSearch}
            onChange={onChange}
            QueryEditor={QueryEditor}
          />

          <Button
            color="primary"
            variant="contained"
            style={{ marginTop: 20, marginBottom: 20, marginRight: 20 }}
            onClick={handleOpen}
          >
            <ExpandMoreIcon />
          </Button>
        </div>
      )}

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
    </React.Fragment>
  )
}
export default QuerySelector
