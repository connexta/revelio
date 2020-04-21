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

type SearchInteraction = {
  id: string
  onSelect: () => void
  interaction: React.FunctionComponent<{}>
}

type HeaderProps = {
  searchInteractions?: SearchInteraction[]
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
        {props.searchInteractions &&
          props.searchInteractions.map(interaction => {
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
  searchInteractions?: SearchInteraction[]
  query?: QueryType
  onSearch: () => void
  queryBuilder: React.FunctionComponent<{
    query?: QueryType
    onChange: (query: QueryType) => void
    addOptionsRef?: HTMLDivElement
  }>
  onChange: (query: QueryType) => void
}

export default (props: EditorProps) => {
  const query = props.query || {}
  const QueryBuilder = props.queryBuilder
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
          searchInteractions={props.searchInteractions}
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
        <Footer onSearch={props.onSearch} />
      </Box>
    </Box>
  )
}
