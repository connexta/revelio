import React, { useContext } from 'react'
import Dialog from '@material-ui/core/Dialog'
import Container from './container'
import { AuthContext } from './auth-provider'
const LogInModal = () => {
  const authenticated = useContext(AuthContext)
  return (
    <Dialog open={!authenticated}>
      <Container label={'Log In'} />
    </Dialog>
  )
}

export default LogInModal
