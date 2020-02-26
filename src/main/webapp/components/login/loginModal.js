import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Container from './container'

const LogInModal = props => {
  const { handleClose, open, label } = props
  return (
    <Dialog open={open}>
      <Container handleClose={handleClose} label={label} />
    </Dialog>
  )
}

export default LogInModal
