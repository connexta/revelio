import React from 'react'
import Popover from '@material-ui/core/Popover'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { ListCreate } from './list-create'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import FolderIcon from '@material-ui/icons/Folder'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'
import CodeIcon from '@material-ui/icons/Code'
import ArchiveIcon from '@material-ui/icons/Archive'
import ListIcon from '@material-ui/icons/List'
import FormLabel from '@material-ui/core/FormLabel'
const iconList = {
  folder: <FolderIcon />,
  code: <CodeIcon />,
  archive: <ArchiveIcon />,
  tasks: <ListIcon />,
}

const CreateNewList = props => {
  return <Button>{'+ Create new list'}</Button>
}

export const ResultListInteraction = props => {
  const { lists } = props
  if (lists == undefined) {
    return <CreateNewList />
  } else {
    return (
      <Box style={{ margin: '15px' }}>
        <FormLabel>Add/Remove from lists</FormLabel>
        <Divider />
        {lists.map(list => {
          return (
            <MenuItem key={list.id}>
              <Checkbox />
              <ListItemIcon>{iconList[list.list_icon]}</ListItemIcon>
              <ListItemText primary={list.title} />
            </MenuItem>
          )
        })}
        <Divider />
        <CreateNewList />
      </Box>
    )
  }
}
