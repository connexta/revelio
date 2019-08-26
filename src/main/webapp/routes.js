import React from 'react'
import {
  HashRouter as Router,
  Route,
  Link as ReactLink,
} from 'react-router-dom'
import MaterialLink from '@material-ui/core/Link'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import InfoSharpIcon from '@material-ui/icons/InfoSharp'
import SearchIcon from '@material-ui/icons/Search'
import CloudIcon from '@material-ui/icons/Cloud'
import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'

import Toolbar from '@material-ui/core/Toolbar'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import OfflineIcon from '@material-ui/icons/OfflineBoltOutlined'
import OnlineIcon from '@material-ui/icons/CloudDoneOutlined'
import AboutRoute from './about.js'

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

const sourcesMessage = offlineCount => {
  if (offlineCount === 0) {
    return 'All sources are currently up'
  }

  if (offlineCount === 1) {
    return '1 source is currently down'
  }

  return `${offlineCount} sources are currently down`
}

const Sources = props => {
  const { sources } = props
  const offlineCount = sources.filter(source => !source.available).length
  const getIcon = source => (source.available ? OnlineIcon : OfflineIcon)

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1">
            {sourcesMessage(offlineCount)}
          </Typography>
          <Divider style={{ marginBottom: 15, marginTop: 10 }} />
          <List>
            {sources.map(source => {
              const Icon = getIcon(source)

              return (
                <ListItem key={source.id}>
                  <ListItemIcon>
                    <Icon key={source.available} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography>{source.id}</Typography>
                  </ListItemText>
                </ListItem>
              )
            })}
          </List>
        </CardContent>
      </Card>
    </div>
  )
}

const SourcesRoute = () => {
  const sources = [
    {
      sourceActions: [],
      available: true,
      id: 'cswFed',
      contentTypes: [],
      version: '2.0.2',
    },
    {
      sourceActions: [],
      available: false,
      id: 'ddf.distribution',
      contentTypes: [],
      version: '',
    },
  ]

  return <Sources sources={sources} />
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
  createRoute('/', 'Home'),
  createRoute('/workspace', 'Workspace'),
  createRoute('/search', 'Search', SearchIcon),
  createRoute('/upload', 'Upload'),
  createRoute('/sources', 'Sources', CloudIcon, SourcesRoute),
  createRoute('/search-forms', 'Search Forms'),
  createRoute('/result-forms', 'Result Forms'),
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
