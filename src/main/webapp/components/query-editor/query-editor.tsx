import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { set } from 'immutable'
import React from 'react'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import { AttributeDefinition, QueryType } from '../query-builder/types'

type QueryInteraction = {
  id: string
  onSelect: () => void
  interaction: React.FunctionComponent<{}>
}

type HeaderProps = {
  queryInteractions?: QueryInteraction[]
  query?: QueryType
  addOptionsRef?: (el: HTMLDivElement) => void
  onChange: (query: QueryType) => void
}

const Header = (props: HeaderProps) => {
  const { query = {} } = props
  const [anchorEl, handleOpen, handleClose, open] = useAnchorEl()

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
      <IconButton
        style={{
          marginLeft: 10,
        }}
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {props.queryInteractions &&
          props.queryInteractions.map(interaction => {
            const { id, onSelect, interaction: Interaction } = interaction
            return (
              <MenuItem
                key={id}
                onClick={() => {
                  handleClose()
                  onSelect()
                }}
              >
                <Interaction />
              </MenuItem>
            )
          })}
      </Menu>
    </Box>
  )
}

type FooterProps = {
  onSearch: () => void
}

const Footer = (props: FooterProps) => {
  return (
    <Box display="flex" height="100%">
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

export type EditorProps = {
  attributeDefinitions?: AttributeDefinition[]
  queryInteractions?: QueryInteraction[]
  query?: QueryType
  onSearch: (query: QueryType) => void
  queryBuilder: React.FunctionComponent<{
    query?: QueryType
    onChange: (query: QueryType) => void
    addOptionsRef?: HTMLDivElement
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
  const [addOptionsRef, setAddOptionsRef] = React.useState<HTMLDivElement>()

  return (
    <Box width="100%" display="flex" flexDirection="column" height="100%">
      <Box
        width="100%"
        style={{
          marginTop: '10px',
        }}
      >
        <Header
          query={query}
          queryInteractions={props.queryInteractions}
          addOptionsRef={el => setAddOptionsRef(el)}
          onChange={props.onChange}
        />
      </Box>

      <Divider />
      <QueryBuilder
        query={query}
        onChange={props.onChange}
        addOptionsRef={addOptionsRef}
      />
      <Box
        width="100%"
        style={{
          marginTop: '10px',
        }}
      >
        <Footer onSearch={onSearch} />
      </Box>
    </Box>
  )
}
