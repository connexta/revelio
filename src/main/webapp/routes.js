import React from "react";
import {
  HashRouter as Router,
  Route,
  Link as ReactLink
} from "react-router-dom";
import MaterialLink from "@material-ui/core/Link";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import InfoSharpIcon from '@material-ui/icons/InfoSharp';
import SearchIcon from "@material-ui/icons/Search";
import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import Toolbar from "@material-ui/core/Toolbar";

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
  );
};

const AboutInfo = ({ title, value }) => {
  return (
    <React.Fragment>
      <Typography variant="h6" component="h2">
        {title}
      </Typography> 
      <Typography color="textSecondary" gutterBottom>
        {value}
      </Typography>
    </React.Fragment>
  )
}


const About = (props = info) => {
  const {version, identifier, releaseDate, branding, appName} = props
  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1">
            {branding} {appName} 
          </Typography> 
          <Divider style={{marginBottom: 15, marginTop: 10}}/>

          <AboutInfo title="Version" value={version} />
          <AboutInfo title="Unique Identifier" value={identifier} />
          <AboutInfo title="Release Date" value={releaseDate} />
        </CardContent>
      </Card>
    </div>
  )
}

const AboutRoute = () => {
  //remove later or keep forever 1000 (you know)
  const info = {
    branding: 'DDF',
    appName: 'Intrigue',
    version: '2.18.0-SNAPSHOT',
    identifier: 'feu7s2abm with Changes',
    releaseDate: 'August 20th 2019'
  }
  return <About {...info} />
}

const createRoute = (path, title, Icon = AccessibleForwardIcon, component) => {
  return {
    title,
    path,
    link: props => {
      const { onClick } = props;
      return (
        <Link to={path} onClick={onClick}>
          <Icon style={{ marginRight: 10 }}/>
          {title}
        </Link>
      );
    },
    component: component || (() => {
      return <h2>{title}</h2>;
    })
  };
};

const routes = [
  createRoute("/", "Home"),
  createRoute("/workspace", "Workspace"),
  createRoute("/search", "Search", SearchIcon),
  createRoute("/upload", "Upload"),
  createRoute("/sources", "Sources"),
  createRoute("/search-forms", "Search Forms"),
  createRoute("/result-forms", "Result Forms"),
  createRoute("/about", "About", InfoSharpIcon, AboutRoute)
];

const NavBar = (props) => {
  const { title = 'That MF Electric Boogaloo', onMenuOpen } = props
  return (
    <AppBar style={{ position: "static" }}>
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
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <Drawer
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        {routes.map(route => {
          const { path, link: Link } = route;
          return (
            <Link onClick={handleDrawerClose} key={path} />
          );
        })}
      </Drawer>
      {routes.map(route => {
        const { title, path, component: Component } = route;
        const Root = () => {
          return (
            <React.Fragment>
              <NavBar title={title} onMenuOpen={handleDrawerOpen} />
              <Component />
            </React.Fragment>
          )
        }
        return <Route key={path} exact path={path} component={Root} />;
      })}
    </Router>
  );
};

export default AppRouter;
