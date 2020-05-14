import User from '../user/user'
import UserSettings from '../user-settings'
import MenuIcon from '@material-ui/icons/Menu'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import React from 'react'
import { useTheme } from '@material-ui/core/styles'
const NavBar = props => {
  const { palette } = useTheme()
  const { title = '', onMenuOpen } = props
  return (
    <AppBar style={{ position: 'static', background: palette.navbar }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          {title}
        </Typography>
        <div
          style={{ marginLeft: 10, flexGrow: 1 }}
          ref={props.navBarLeftRef}
        />
        <UserSettings />
        <User />
      </Toolbar>
    </AppBar>
  )
}
export default NavBar
