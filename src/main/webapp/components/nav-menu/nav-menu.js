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
export default NavMenu
