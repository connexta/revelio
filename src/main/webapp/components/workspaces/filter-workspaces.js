import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const FilterWorkspaces = ({ onFilter, userAttributes }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const options = ['Owned by anyone', 'Owned by me', 'Not owned by me']

  const filterByAnyone = workspace => true
  const filterByMe = workspace =>
    workspace.attributes.metacard_owner === userAttributes.email
  const filterByNotMe = workspace =>
    workspace.attributes.metacard_owner !== userAttributes.email

  const filter = index => {
    switch (index) {
      case 0:
        onFilter(filterByAnyone)
        break
      case 1:
        onFilter(filterByMe)
        break
      case 2:
        onFilter(filterByNotMe)
        break
      default:
        onFilter(filterByAnyone)
    }
  }

  const handleClickListItem = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleMenuItemClick = (e, index) => {
    setSelectedIndex(index)
    setAnchorEl(null)
    filter(index)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <List component="nav">
        <ListItem button onClick={handleClickListItem}>
          <ListItemText
            primary="Filter workspaces"
            secondary={options[selectedIndex]}
          />
        </ListItem>
      </List>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}

export default FilterWorkspaces
