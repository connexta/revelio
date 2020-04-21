import React from 'react'

import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'

import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward'
import CloudIcon from '@material-ui/icons/Cloud'
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark'
import FindInPageIcon from '@material-ui/icons/FindInPage'

import InfoSharpIcon from '@material-ui/icons/InfoSharp'

import SearchIcon from '@material-ui/icons/Search'
import ViewListIcon from '@material-ui/icons/ViewList'

import ListItemText from '@material-ui/core/ListItemText'
import LinearProgress from '@material-ui/core/LinearProgress'

import { useTheme } from '@material-ui/core/styles'
import { ThemeProvider } from './theme'

import { SelectionProvider } from './react-hooks/use-selection-interface'
import { DrawProvider } from './react-hooks/use-draw-interface'
import { Link as ReactLink, Route, matchPath } from 'react-router-dom'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import loadable from 'react-loadable'

import url from 'url'
import NavBar, { NavigationBarContext } from './components/nav-bar'
import NavMenu from './components/nav-menu'
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
        return (await import(/* webpackChunkName: "workspace" */ './components/workspace'))
          .default
      },
      loading: LoadingComponent,
    }),
    workspaces: loadable({
      loader: async () =>
        (await import(/* webpackChunkName: "workspaces-index" */ './components/workspaces'))
          .default,
      loading: LoadingComponent,
    }),
    sources: loadable({
      loader: () =>
        import(/* webpackChunkName: "sources" */ './components/sources-info'),
      loading: LoadingComponent,
    }),
    'simple-search': loadable({
      loader: () =>
        import(/* webpackChunkName: "simple-search" */ './components/simple-search'),
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
        import(/* webpackChunkName: "result-forms" */ './components/result-forms'),
      loading: LoadingComponent,
    }),
    'search-forms': loadable({
      loader: async () => {
        return (await import(/* webpackChunkName: "search-forms" */ './components/search-forms'))
          .default
      },
      loading: LoadingComponent,
    }),
    about: loadable({
      loader: () =>
        import(/* webpackChunkName: "about" */ './components/about'),
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
    title: '',
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

const AppRouter = () => {
  const [open, setOpen] = React.useState(false)
  const [navBarLeftRef, setNavBarLeftRef] = React.useState()
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
                <NavigationBarContext.Provider value={navBarLeftRef}>
                  <NavBar
                    title={title}
                    onMenuOpen={handleDrawerOpen}
                    navBarLeftRef={el => setNavBarLeftRef(el)}
                  />
                  <div
                    style={{
                      overflow: 'auto',
                      height: 'calc(100vh - 64px)',
                    }}
                  >
                    <Component />
                  </div>
                </NavigationBarContext.Provider>
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
