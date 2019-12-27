import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import React from 'react'
import {
  Actions,
  DeleteAction,
  EditAction,
  IndexCardItem,
} from '../index-cards'

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
  const { title, onClick, QueryEditor, query } = props
  const [anchorEl, open, handleOpen, handleClose] = useOpenClose(props)

  return (
    <React.Fragment>
      <IndexCardItem
        title={title}
        subHeader={'Has not been run'}
        onClick={onClick}
      >
        <Actions>
          <EditAction onEdit={handleOpen} />
          <DeleteAction />
        </Actions>
      </IndexCardItem>

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
        <QueryEditor query={query} onSearch={handleClose} />
      </Popover>
    </React.Fragment>
  )
}

const QuerySelector = props => {
  const { queries, currentQuery, QueryEditor } = props
  const [selected, setSelected] = React.useState(null)
  const [anchorEl, open, handleOpen, handleClose] = useOpenClose(props)

  const onSelect = query => {
    setSelected(queries.filter(({ id }) => id === query.id)[0])
    props.onSelect(query)
  }

  const queryCards = queries.map(query => (
    <QueryCard
      key={query.id}
      query={query}
      title={query.title}
      onClick={() => {
        onSelect(query)
      }}
      QueryEditor={QueryEditor}
      onClose={handleClose}
    />
  ))

  return (
    <React.Fragment>
      {queries && (
        <div style={{ display: 'flex' }}>
          <QueryCard
            title={selected ? selected.title : queries[0].title}
            onClick={() => {
              props.onSelect(currentQuery)
            }}
            query={currentQuery}
            QueryEditor={QueryEditor}
            onClose={handleClose}
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
