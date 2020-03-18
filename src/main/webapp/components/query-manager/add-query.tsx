import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import React from 'react'
import { NavigationBarContext } from '../../nav-bar-context'
import QueryEditorPopover from './query-editor-popover'
import { AddQueryProps } from './types'
const ReactDOM = require('react-dom')

export default (props: AddQueryProps) => {
  const [query, setQuery] = React.useState<{ id?: string }>({
    id: new Date().toString(),
  })
  const { onSearch, QueryEditor } = props

  const navBarLeftRef = React.useContext(NavigationBarContext)
  const [anchorEl, setAnchorEl] = React.useState<any>(null)
  const handleOpen = () => {
    setAnchorEl(navBarLeftRef)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

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

      {!props.hasQueries && (
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
        onSearch={query => {
          onSearch(query)
          handleClose()
          setQuery({ id: new Date().toString() })
        }}
        onChange={query => setQuery(query)}
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </React.Fragment>
  )
}
