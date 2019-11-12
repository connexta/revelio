import { useQuery } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/Person'
import gql from 'graphql-tag'
import React from 'react'
import { useApolloFallback } from './react-hooks'

const UserDrawer = props => (
  <Drawer
    ModalProps={{ disableEnforceFocus: true }}
    anchor="right"
    open={props.open}
    onClose={props.onClose}
  >
    {props.children}
  </Drawer>
)

const UserInfo = props => (
  <div
    style={{
      width: 360,
      marginTop: 20,
      marginLeft: 20,
      overflow: 'auto',
    }}
  >
    <ListItemText>
      <Typography variant="h6">{props.username}</Typography>
    </ListItemText>
    <ListItemText>{props.email}</ListItemText>
  </div>
)

const User = props => {
  const { email, isGuest, username } = props.value
  const [open, setOpen] = React.useState(props.open)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const signOut = () => {
    window.location.href = '../../logout?service=' + window.location.href
  }

  return (
    <React.Fragment>
      <Button
        color="inherit"
        style={{ textTransform: 'none' }}
        onClick={handleDrawerOpen}
      >
        <PersonIcon />
        <Typography variant="h6">Admin</Typography>
      </Button>

      <UserDrawer open={open} onClose={handleDrawerClose}>
        <UserInfo email={email} username={username} />
        <Divider style={{ marginTop: 10, marginBottom: 15 }} />
        {isGuest ? null : (
          <Button color="secondary" onClick={signOut}>{`Sign Out`}</Button>
        )}
      </UserDrawer>
    </React.Fragment>
  )
}

const query = gql`
  query UserPreferences {
    user {
      email
      isGuest
      username
    }
  }
`

const Container = () => {
  const { error, data, loading } = useQuery(query)
  return loading || error ? null : <User value={data.user} />
}

export default props => {
  const Component = useApolloFallback(Container, User)
  return <Component {...props} />
}
