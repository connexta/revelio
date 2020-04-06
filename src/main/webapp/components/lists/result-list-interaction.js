import React from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { ListCreatePopover } from './list-create'
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
import useAnchorEl from '../../react-hooks/use-anchor-el'

const iconList = {
  folder: <FolderIcon />,
  code: <CodeIcon />,
  archive: <ArchiveIcon />,
  tasks: <ListIcon />,
}

const CreateNewList = props => {
  const [anchorEl, handleOpen, handleClose, isOpen] = useAnchorEl()
  return (
    <React.Fragment>
      {' '}
      <Button onClick={handleOpen}>{'+ Create new list'}</Button>
      <ListCreatePopover
        anchorEl={anchorEl}
        onClose={handleClose}
        open={isOpen}
        setList={props.setList}
      />
    </React.Fragment>
  )
}

const List = props => {
  const { list, selected, setList, id } = props
  const [checked, setChecked] = React.useState(selected)
  return (
    <MenuItem>
      <Checkbox
        checked={checked}
        onClick={() => {
          setChecked(!checked)
          const indexOfId = list.list_bookmarks.indexOf(id)
          indexOfId === -1
            ? list.list_bookmarks.push(id)
            : list.list_bookmarks.splice(indexOfId, 1)
          setList(list)
        }}
      />
      <ListItemIcon>{iconList[list.list_icon]}</ListItemIcon>
      <ListItemText primary={list.title} />
    </MenuItem>
  )
}

export const ResultListInteraction = props => {
  const { lists, id, setList } = props
  if (lists == undefined) {
    return <CreateNewList setList={setList} />
  } else {
    return (
      <Box style={{ margin: '15px' }}>
        <FormLabel>Add/Remove from lists</FormLabel>
        <Divider />
        {lists.map((list, index) => {
          const selected = list.list_bookmarks.includes(id)
          return (
            <List
              key={index}
              selected={selected}
              list={list}
              setList={setList}
              id={id}
            />
          )
        })}
        <Divider />
        <CreateNewList setList={setList} />
      </Box>
    )
  }
}
