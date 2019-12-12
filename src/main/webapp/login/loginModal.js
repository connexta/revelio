import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import LogIn from './login'

export const LogInModal = props => {
  const { handleClose, open } = props
  return (
    <Dialog open={open} onClose={handleClose}>
      <LogIn handleClose={handleClose} />
    </Dialog>
  )
}

export default LogInModal
