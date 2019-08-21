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

const Link = props => {
  return (
    <Typography>
      <Button
        fullWidth
        onClick={props.onClick}
        to={props.to}
        component={ReactLink}
      >
        {props.children}
      </Button>
    </Typography>
  )
}

const createRoute = (path, title) => {
  return {
    path,
    link: props => {
      const { onClick } = props
      return (
        <Link to={path} onClick={onClick}>
          {title}
        </Link>
      )
    },
    component: () => {
      return <h2>{title}</h2>
    },
  }
}

const routes = [
  createRoute('/workspace', 'Workspace'),
  createRoute('/search', 'Search'),
  createRoute('/upload', 'Upload'),
  createRoute('/sources', 'Sources'),
  createRoute('/search-forms', 'Search Forms'),
  createRoute('/result-forms', 'Result Forms'),
  createRoute('/about', 'About'),
]

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
      <div>
        <Drawer
          //className={classes.drawer}
          //variant="persistent"
          anchor="left"
          open={open}
          onClose={handleDrawerClose}
          // classes={{
          //   paper: classes.drawerPaper,
          // }}
        >
          {routes.map(route => {
            const { path, link: Link } = route
            return (
              //<div key={path}>
              //<Button onClick={handleDrawerClose} >
              <Link onClick={handleDrawerClose} key={path} />
              //</Button>
              //</div>
            )
          })}
        </Drawer>

        <Button onClick={handleDrawerOpen}> MFEB</Button>
        {routes.map(route => {
          const { path, component } = route
          return <Route key={path} path={path} component={component} />
        })}
      </div>
    </Router>
  )
}

export default AppRouter
