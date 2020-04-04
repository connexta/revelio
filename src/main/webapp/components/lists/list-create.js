import React from 'react'
import FolderIcon from '@material-ui/icons/Folder'
import ArchiveIcon from '@material-ui/icons/Archive'
import CodeIcon from '@material-ui/icons/Code'
import ListIcon from '@material-ui/icons/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { RadioButton } from '../input'
import Popover from '@material-ui/core/Popover'
import Box from '@material-ui/core/Box'
import { v4 as newUuid } from 'uuid'

const iconList = {
  folder: <FolderIcon />,
  code: <CodeIcon />,
  archive: <ArchiveIcon />,
  tasks: <ListIcon />,
}

const ListIconType = props => {
  const { label } = props
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <ListItemIcon>{iconList[label]}</ListItemIcon>
      <ListItemText primary={label} />
    </div>
  )
}

export const ListCreatePopover = props => {
  const { list, anchorEl, onClose, open, onSave, setList } = props
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box style={{ margin: '10px' }}>
        <ListCreate
          list={list}
          onClose={onClose}
          onSave={onSave}
          setList={setList}
        />
      </Box>
    </Popover>
  )
}

export const ListCreate = props => {
  const { onClose, onSave } = props

  const [list, setList] = React.useState(
    props.list || {
      id: newUuid().replace(/-/g, ''),
      list_icon: 'folder',
      list_bookmarks: [],
      query: undefined,
      title: 'Untitled List',
    }
  )

  const handleIconChange = event => {
    setList({ ...list, list_icon: event.target.value })
  }
  const handleTitleChange = event => {
    setList({ ...list, title: event.target.value })
  }

  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <TextField
        style={{ marginBottom: '20px' }}
        variant="outlined"
        label="Title"
        value={list.title}
        onChange={handleTitleChange}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
        }}
      />
      <RadioButton
        label="Limit based on filter"
        buttonText={[
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ]}
        value={list.useFilter === true}
        onChange={e => setList({ ...list, useFilter: e })}
      />
      {/*TODO Add Filtering capablities*/}
      <TextField
        select
        variant="outlined"
        label="List Icon"
        value={list.list_icon}
        onChange={handleIconChange}
        style={{ marginBottom: '20px' }}
      >
        {Object.keys(iconList).map(item => {
          return (
            <MenuItem key={item} value={item}>
              <ListIconType label={item} />
            </MenuItem>
          )
        })}
      </TextField>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          style={{ width: '49%' }}
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ width: '49%' }}
          onClick={() => {
            props.setList(list)
            onSave()
            onClose()
          }}
        >
          Save
        </Button>
      </div>
    </FormControl>
  )
}
