import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ListItemText from '@material-ui/core/ListItemText'
import Popover from '@material-ui/core/Popover'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SearchIcon from '@material-ui/icons/Search'
import { getIn, set } from 'immutable'
import React, { useEffect, useRef, useState } from 'react'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import { BasicSearchQueryBuilder } from '../basic-search/basic-search'
import {
  Actions,
  DeleteAction,
  EditAction,
  IndexCardItem,
} from '../index-cards'
import AdvancedSearchQueryBuilder from '../query-builder/query-builder'
const { useDrawInterface } = require('../../react-hooks')

const defaultSearchForms = {
  basic: {
    label: 'Basic Search',
    queryBuilder: BasicSearchQueryBuilder,
  },
  advanced: {
    label: 'Advanced Search',
    queryBuilder: AdvancedSearchQueryBuilder,
  },
}

const getBaseQueryFields = query => {
  const { id, title, type } = query
  return { id, title, type }
}

const defaultSearchFormInteractions = onSelect => {
  return Object.keys(defaultSearchForms).map(key => {
    return {
      id: key,
      onSelect: () => onSelect(key),
      interaction: () => (
        <React.Fragment>
          <SearchIcon style={{ marginRight: 10 }} />
          <ListItemText>
            {getIn(defaultSearchForms, [key, 'label'])}
          </ListItemText>
        </React.Fragment>
      ),
    }
  })
}
const QueryCard = props => {
  const { onSearch, QueryEditor, query } = props
  const [anchorEl, handleOpen, handleClose, open] = useAnchorEl()
  const [{ active: isDrawing }] = useDrawInterface()
  const [wasDrawing, setWasDrawing] = useState(false)
  const drawAnchorEl = useRef(null)
  const popoverActions = useRef()
  const queryBuilder = defaultSearchForms.hasOwnProperty(query.type)
    ? query.type
    : 'advanced'

  const onChange = query => {
    props.onChange(query)
    if (popoverActions.current) {
      popoverActions.current.updatePosition()
    }
  }

  const queryInteractions = [
    ...defaultSearchFormInteractions(key => {
      if (key !== query.type) {
        onChange(set(getBaseQueryFields(query), 'type', key))
      }
    }),
  ]

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
      <Popover
        action={popoverActions}
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
            query={query}
            queryBuilder={getIn(defaultSearchForms, [
              queryBuilder,
              'queryBuilder',
            ])}
            queryInteractions={queryInteractions}
            onSearch={query =>
              onSearch({ ...getBaseQueryFields(props.query), ...query })
            }
            onChange={query =>
              onChange({ ...getBaseQueryFields(props.query), ...query })
            }
          />
        </Box>
      </Popover>
    </React.Fragment>
  )
}

const QuerySelector = props => {
  const { queries, currentQuery, QueryEditor, onSearch } = props
  const [anchorEl, handleOpen, handleClose, open] = useAnchorEl()

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
