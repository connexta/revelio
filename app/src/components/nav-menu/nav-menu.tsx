import React, { Fragment } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import { getIn } from 'immutable'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import NextLink from 'next/link'
import InfoSharpIcon from '@material-ui/icons/InfoSharp'
import { IconProps } from '@material-ui/core/Icon'
import CloudIcon from '@material-ui/icons/Cloud'
import ViewListIcon from '@material-ui/icons/ViewList'
import SearchIcon from '@material-ui/icons/Search'
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark'

const query = gql`
  query NavigationBar {
    systemProperties {
      branding
      product
    }
  }
`

type NavMenuProps = {
  onSelect: () => void
}

type LinkProps = NavMenuProps & {
  routeUrl: string
  displayName: string
  Icon: React.SFC<IconProps>
}

const Link = (props: LinkProps) => {
  const { onSelect, routeUrl, displayName, Icon } = props
  return (
    <NextLink href={routeUrl}>
      <ListItem>
        <Button fullWidth onClick={onSelect}>
          <ListItemIcon>
            <Icon style={{ marginRight: 10 }} />
          </ListItemIcon>
          <ListItemText style={{ textAlign: 'left' }} primary={displayName} />
        </Button>
      </ListItem>
    </NextLink>
  )
}

const routes = [
  {
    routeUrl: '/workspaces',
    displayName: 'Workspaces',
    Icon: CollectionsBookmarkIcon,
  },
  {
    routeUrl: '/simple-search',
    displayName: 'Simple Search',
    Icon: SearchIcon,
  },
  {
    routeUrl: '/sources',
    displayName: 'Sources',
    Icon: CloudIcon,
  },
  {
    routeUrl: '/search-forms',
    displayName: 'Search Forms',
    Icon: SearchIcon,
  },
  {
    routeUrl: '/result-forms',
    displayName: 'Result Forms',
    Icon: ViewListIcon,
  },
  {
    routeUrl: '/about',
    displayName: 'About',
    Icon: InfoSharpIcon,
  },
]

const NavMenu = (props: NavMenuProps) => {
  const { data } = useQuery(query)

  const branding = getIn(data, ['systemProperties', 'branding'], '')
  const product = getIn(data, ['systemProperties', 'product'], '')
  const { onSelect } = props
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
        return <Link key={route.routeUrl} onSelect={onSelect} {...route} />
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
export default NavMenu
