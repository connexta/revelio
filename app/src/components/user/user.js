import { useQuery } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/Person'
import gql from 'graphql-tag'
import React from 'react'
import { useApolloFallback } from '../../react-hooks'
import Cookies from 'universal-cookie'
import LinearProgress from '@material-ui/core/LinearProgress'
import ErrorMessage from '../network-retry/inline-retry'
import { getIn } from 'immutable'

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

export const User = props => {
  const { email, isGuest, username } = props.value
  const [open, setOpen] = React.useState(props.open)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const signOut = () => {
    const cookies = new Cookies()
    cookies.remove('RSESSION', { path: '/' })
    location.reload(true)
  }

  return (
    <React.Fragment>
      <Button
        color="inherit"
        style={{ textTransform: 'none' }}
        onClick={handleDrawerOpen}
      >
        <PersonIcon />
        <Typography variant="h6">{username || 'User'}</Typography>
      </Button>
      <UserDrawer open={open} onClose={handleDrawerClose}>
        {props.error ? (
          <ErrorMessage onRetry={props.refetch}>
            Error Retrieving User Information
          </ErrorMessage>
        ) : (
          <React.Fragment>
            <UserInfo email={email} username={username} />
            <Divider style={{ marginTop: 10, marginBottom: 15 }} />
            {isGuest ? null : (
              <Button color="secondary" onClick={signOut}>{`Sign Out`}</Button>
            )}
          </React.Fragment>
        )}
      </UserDrawer>
    </React.Fragment>
  )
}

const query = gql`
  query User {
    user {
      email
      isGuest
      username
    }
  }
`

const Container = () => {
  const { error, data, loading, refetch } = useQuery(query)

  if (loading) return <LinearProgress />

  return (
    <User value={getIn(data, ['user'], {})} error={error} refetch={refetch} />
  )
}

export default props => {
  const Component = useApolloFallback(Container, User)
  return <Component {...props} />
}
