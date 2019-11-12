import React, { Fragment } from 'react'

import { getIn } from 'immutable'

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
import SearchIcon from '@material-ui/icons/Search'
import ViewListIcon from '@material-ui/icons/ViewList'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import { useTheme } from '@material-ui/core/styles'
import { ThemeProvider } from './theme'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import { SelectionProvider } from './react-hooks/use-selection-interface'
import { Link as ReactLink, Route } from 'react-router-dom'

import AboutRoute from './about'
import SourcesRoute from './sources'
import SimpleSearch from './simple-search'
import ResultForms from './result-forms'
import WorkspacesIndex, { Workspace } from './workspaces/workspaces'
import UserSettings from './user-settings'
import User from './user'

const Link = props => {
  return (
    <Button
      fullWidth
      onClick={props.onClick}
      to={props.to}
      component={ReactLink}
      style={{ justifyContent: 'flex-start' }}
    >
      {props.children}
    </Button>
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
          <ListItemIcon>
            <Icon style={{ marginRight: 10 }} />
          </ListItemIcon>
          <ListItemText primary={title} />
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
  createRoute('/', 'Workspaces', CollectionsBookmarkIcon, WorkspacesIndex),
  createRoute('/search', 'Search', SearchIcon, SimpleSearch),
  createRoute('/sources', 'Sources', CloudIcon, SourcesRoute),
  createRoute('/search-forms', 'Search Forms', FindInPageIcon),
  createRoute('/result-forms', 'Result Forms', ViewListIcon, ResultForms),
  createRoute('/about', 'About', InfoSharpIcon, AboutRoute),
]

const NavBar = props => {
  const { palette } = useTheme()
  const { title = 'That MF Electric Boogaloo', onMenuOpen } = props
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
        <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <UserSettings />
        <User />
      </Toolbar>
    </AppBar>
  )
}

const otherRoutes = [
  { title: 'Workspace', path: '/workspaces/:id', component: Workspace },
]

const query = gql`
  query NavigationBar {
    systemProperties {
      branding
      product
    }
  }
`

const NavMenu = props => {
  const { data } = useQuery(query)

  const branding = getIn(data, ['systemProperties', 'branding'], '')
  const product = getIn(data, ['systemProperties', 'product'], '')

  const { routes, onClose } = props

  return (
    <List style={{ width: 300 }}>
      {branding !== '' ? (
        <Fragment>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ style: { fontSize: '2rem' } }}
              secondaryTypographyProps={{ style: { fontSize: '1.3rem' } }}
              primary={branding}
              secondary={product}
            />
          </ListItem>
          <Divider />
        </Fragment>
      ) : null}
      {routes.map(route => {
        const { path, link: Link } = route
        return (
          <ListItem key={path}>
            <Link onClick={onClose} />
          </ListItem>
        )
      })}
      <Divider />
      <ListItem>
        <Button
          fullWidth
          href="/"
          component="a"
          style={{ justifyContent: 'flex-start' }}
        >
          <ListItemIcon>
            <HomeIcon style={{ marginRight: 10 }} />
          </ListItemIcon>
          <ListItemText primary={`${branding || ''} Home`} />
        </Button>
      </ListItem>
    </List>
  )
}

const AppRouter = () => {
  const [open, setOpen] = React.useState(false)
  const { palette } = useTheme()

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <SelectionProvider>
      <div
        style={{
          color: palette.text.primary,
          background: palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Drawer anchor="left" open={open} onClose={handleDrawerClose}>
          <NavMenu routes={routes} onClose={handleDrawerClose} />
        </Drawer>
        {routes.concat(otherRoutes).map(route => {
          const { title, path, component: Component } = route
          const render = () => {
            return (
              <React.Fragment>
                <NavBar title={title} onMenuOpen={handleDrawerOpen} />
                <Component />
              </React.Fragment>
            )
          }
          return <Route key={path} exact path={path} render={render} />
        })}
      </div>
    </SelectionProvider>
  )
}

export default () => {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  )
}
