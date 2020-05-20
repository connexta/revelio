import React from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { ListCreatePopover } from './list-create'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'
import FormLabel from '@material-ui/core/FormLabel'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import ListIcons from './icons'

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
        onSave={props.saveLists}
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
          if (list.list_bookmarks) {
            const indexOfId = list.list_bookmarks.indexOf(id)
            indexOfId === -1
              ? list.list_bookmarks.push(id)
              : list.list_bookmarks.splice(indexOfId, 1)
            setList(list)
          } else {
            list.list_bookmarks = [id]
            setList(list)
          }
        }}
      />
      <ListItemIcon>{ListIcons[list.list_icon]}</ListItemIcon>
      <ListItemText primary={list.title} />
    </MenuItem>
  )
}

export const ResultListInteraction = props => {
  const { lists, id, setList, saveLists } = props
  if (lists == undefined) {
    return <CreateNewList setList={setList} saveLists={saveLists} />
  } else {
    return (
      <Box style={{ margin: '15px' }}>
        <FormLabel>Add/Remove from lists</FormLabel>
        <Divider />
        {lists.map((list, index) => {
          const selected = list.list_bookmarks
            ? list.list_bookmarks.includes(id)
            : false
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
        <CreateNewList setList={setList} saveLists={saveLists} />
      </Box>
    )
  }
}
