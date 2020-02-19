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
import LinearProgress from '@material-ui/core/LinearProgress'

import { useTheme } from '@material-ui/core/styles'
import { ThemeProvider } from './theme'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import { SelectionProvider } from './react-hooks/use-selection-interface'
import { DrawProvider } from './react-hooks/use-draw-interface'
import { Link as ReactLink, Route, matchPath } from 'react-router-dom'

import User from './user'
import UserSettings from './user-settings'
import loadable from 'react-loadable'

import url from 'url'

export const LoadingComponent = () => <LinearProgress />

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

const loadDynamicRoute = route => {
  const routes = {
    workspace: loadable({
      loader: async () => {
        return (await import(/* webpackChunkName: "workspace" */ './workspaces/workspaces'))
          .Workspace
      },
      loading: LoadingComponent,
    }),
    workspaces: loadable({
      loader: () =>
        import(/* webpackChunkName: "workspaces-index" */ './new-workspaces'),
      loading: LoadingComponent,
    }),
    sources: loadable({
      loader: () => import(/* webpackChunkName: "sources" */ './sources'),
      loading: LoadingComponent,
    }),
    'simple-search': loadable({
      loader: () =>
        import(/* webpackChunkName: "simple-search" */ './simple-search'),
      loading: LoadingComponent,
    }),
    search: loadable({
      loader: () =>
        import(/* webpackChunkName: "page-search" */ './search/search'),
      loading: LoadingComponent,
    }),
    'search-results': loadable({
      loader: () =>
        import(/* webpackChunkName: "page-results" */ './search/results'),
      loading: LoadingComponent,
    }),
    'search-details': loadable({
      loader: () =>
        import(/* webpackChunkName: "page-details" */ './search/details'),
      loading: LoadingComponent,
    }),
    'result-forms': loadable({
      loader: () =>
        import(/* webpackChunkName: "result-forms" */ './result-forms'),
      loading: LoadingComponent,
    }),
    'search-forms': loadable({
      loader: async () => {
        return (await import(/* webpackChunkName: "search-forms" */ './search-forms'))
          .default
      },
      loading: LoadingComponent,
    }),
    about: loadable({
      loader: () => import(/* webpackChunkName: "about" */ './about'),
      loading: LoadingComponent,
    }),
  }

  return routes[route]
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
  createRoute(
    '/',
    'Workspaces',
    CollectionsBookmarkIcon,
    loadDynamicRoute('workspaces')
  ),
  createRoute(
    '/simple-search',
    'Simple Search',
    SearchIcon,
    loadDynamicRoute('simple-search')
  ),
  createRoute('/search', 'Search', SearchIcon, loadDynamicRoute('search')),
  createRoute('/sources', 'Sources', CloudIcon, loadDynamicRoute('sources')),
  createRoute(
    '/search-forms',
    'Search Forms',
    FindInPageIcon,
    loadDynamicRoute('search-forms')
  ),
  createRoute(
    '/result-forms',
    'Result Forms',
    ViewListIcon,
    loadDynamicRoute('result-forms')
  ),
  createRoute('/about', 'About', InfoSharpIcon, loadDynamicRoute('about')),
]

const otherRoutes = [
  {
    title: 'Workspace',
    path: '/workspaces/:id',
    component: loadDynamicRoute('workspace'),
  },
  {
    title: 'Results',
    path: '/search/results',
    component: loadDynamicRoute('search-results'),
  },
  {
    title: 'Details',
    path: '/search/results/:id',
    component: loadDynamicRoute('search-details'),
  },
]

export const hasPath = path => {
  return routes.concat(otherRoutes).some(route => {
    const { pathname } = url.parse(path)
    const match = matchPath(pathname, {
      path: route.path,
      exact: true,
      strict: false,
    })
    return match
  })
}

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
    <DrawProvider>
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
                  <div
                    style={{
                      overflow: 'auto',
                      height: 'calc(100vh - 64px)',
                    }}
                  >
                    <Component />
                  </div>
                </React.Fragment>
              )
            }
            return <Route key={path} exact path={path} render={render} />
          })}
        </div>
      </SelectionProvider>
    </DrawProvider>
  )
}

export default () => {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  )
}
