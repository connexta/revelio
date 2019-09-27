import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward'
import CloudIcon from '@material-ui/icons/Cloud'
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark'
import FindInPageIcon from '@material-ui/icons/FindInPage'
import HomeIcon from '@material-ui/icons/Home'
import InfoSharpIcon from '@material-ui/icons/InfoSharp'
import MenuIcon from '@material-ui/icons/Menu'
import PublishIcon from '@material-ui/icons/Publish'
import SearchIcon from '@material-ui/icons/Search'
import ViewListIcon from '@material-ui/icons/ViewList'

import {
  HashRouter as Router,
  Link as ReactLink,
  Route,
} from 'react-router-dom'

import AboutRoute from './about'
import SourcesRoute from './sources'
import SimpleSearch from './simple-search'

const Link = props => {
  return (
    <Typography>
      <Button
        fullWidth
        onClick={props.onClick}
        to={props.to}
        component={ReactLink}
        style={{ justifyContent: 'flex-start' }}
      >
        {props.children}
      </Button>
    </Typography>
  )
}

const createRoute = (path, title, Icon = AccessibleForwardIcon, component) => {
  return {
    title,
    path,
    link: props => {
      const { onClick } = props
      return (
        <Link to={path} onClick={onClick}>
          <Icon style={{ marginRight: 10 }} />
          {title}
        </Link>
      )
    },
    component:
      component ||
      (() => {
        return <h2>{title}</h2>
      }),
  }
}

const routes = [
  createRoute('/', 'Home', HomeIcon),
  createRoute('/workspaces', 'Workspaces', CollectionsBookmarkIcon),
  createRoute('/search', 'Search', SearchIcon, SimpleSearch),
  createRoute('/upload', 'Upload', PublishIcon),
  createRoute('/sources', 'Sources', CloudIcon, SourcesRoute),
  createRoute('/search-forms', 'Search Forms', FindInPageIcon),
  createRoute('/result-forms', 'Result Forms', ViewListIcon),
  createRoute('/about', 'About', InfoSharpIcon, AboutRoute),
]

const NavBar = props => {
  const { title = 'That MF Electric Boogaloo', onMenuOpen } = props
  return (
    <AppBar style={{ position: 'static' }}>
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
      </Toolbar>
    </AppBar>
  )
}

const AppRouter = () => {
  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Router>
      <Drawer anchor="left" open={open} onClose={handleDrawerClose}>
        {routes.map(route => {
          const { path, link: Link } = route
          return <Link onClick={handleDrawerClose} key={path} />
        })}
      </Drawer>
      {routes.map(route => {
        const { title, path, component: Component } = route
        const Root = () => {
          return (
            <React.Fragment>
              <NavBar title={title} onMenuOpen={handleDrawerOpen} />
              <Component />
            </React.Fragment>
          )
        }
        return <Route key={path} exact path={path} component={Root} />
      })}
    </Router>
  )
}

export default AppRouter
