import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import LogIn from './login'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

export const LogInModal = props => {
  const { handleClose, open } = props
  return (
    <Dialog open={open} onClose={handleClose}>
      <LogIn handleClose={handleClose} />
    </Dialog>
  )
}

export default LogInModal
