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
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import FormLabel from '@material-ui/core/FormLabel'
import { RadioButton } from '../input'
import Popover from '@material-ui/core/Popover'
import Box from '@material-ui/core/Box'

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
  const { title = '', anchorEl, onClose, open } = props
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
        <ListCreate title={title} onClose={onClose} />
      </Box>
    </Popover>
  )
}

export const ListCreate = props => {
  const { title = '', onClose } = props
  const [list, setList] = React.useState({
    icon: 'folder',
    useFilter: 1,
    filterTree: {},
    title: title,
  })
  const handleIconChange = event => {
    setList({ ...list, icon: event.target.value })
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
        buttonText={[{ text: 'Yes', index: 0 }, { text: 'No', index: 1 }]}
        defaultButton={1}
        onChange={e => setList({ ...list, useFilter: e })}
      />
      <TextField
        select
        variant="outlined"
        label="List Icon"
        value={list.icon}
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
        <Button variant="contained" color="secondary" style={{ width: '49%' }}>
          Save
        </Button>
      </div>
    </FormControl>
  )
}
