import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import React from 'react'
const { NavigationBarContext } = require('../nav-bar')
import QueryEditorPopover from './query-editor-popover'
import { AddQueryProps } from './types'
const ReactDOM = require('react-dom')

export default (props: AddQueryProps) => {
  const [query, setQuery] = React.useState({})
  const { QueryEditor, queries, onCreate } = props

  const navBarLeftRef = React.useContext(NavigationBarContext)
  const [anchorEl, setAnchorEl] = React.useState<any>(null)
  const handleOpen = () => {
    setAnchorEl(navBarLeftRef)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const hasQueries = queries && queries.length > 0
  const CreateSearch = () =>
    navBarLeftRef
      ? ReactDOM.createPortal(
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Create a Search
          </Button>,
          navBarLeftRef
        )
      : null

  return (
    <React.Fragment>
      <CreateSearch />

      {!hasQueries && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Typography color="textSecondary">
            New searches will appear here
            <br />
            <SearchIcon style={{ fontSize: '9rem' }} />
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Create a Search
          </Button>
        </div>
      )}
      <QueryEditorPopover
        query={query}
        QueryEditor={QueryEditor}
        onSearch={() => {
          onCreate(query)
          handleClose()
          setQuery({})
        }}
        onChange={query => setQuery(query)}
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </React.Fragment>
  )
}
