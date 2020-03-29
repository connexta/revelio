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
        {lists.map(list => {
          return (
            <MenuItem key={list.id}>
              <Checkbox />
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
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
