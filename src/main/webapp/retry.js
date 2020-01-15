import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Button from '@material-ui/core/Button'

export default props => {
  const {
    message,
    autoHideDuration = 15000,
    backgroundColor = '#e74c3c',
    color = 'white',
    refetch,
  } = props

  // TODO: Do we want to provide options to hide the snackbar for network failures?
  const [open, setOpen] = useState(true)

  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      message={message}
    >
      <SnackbarContent
        style={{
          backgroundColor,
          color,
        }}
        action={
          <React.Fragment>
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                refetch()
              }}
            >
              Retry
            </Button>
          </React.Fragment>
        }
        message={<span id="client-snackbar">{message}</span>}
      />
    </Snackbar>
  )
}
