import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

export default props => {
  const {
    message,
    backgroundColor = '#e74c3c',
    color = 'white',
    onRetry = () => null,
  } = props

  const [loading, setLoading] = useState(false)

  return (
    <Snackbar
      open={true}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      message={message}
    >
      <SnackbarContent
        style={{
          backgroundColor,
          color,
        }}
        action={
          <Button
            disabled={loading}
            color="inherit"
            size="small"
            onClick={async () => {
              setLoading(true)
              try {
                await onRetry()
              } catch (err) {
                //eslint-disable-next-line
                console.log(err)
              }
              setLoading(false)
            }}
          >
            Retry
            {loading ? (
              <CircularProgress
                style={{ marginLeft: 10 }}
                size={15}
                color="inherit"
              />
            ) : null}
          </Button>
        }
        message={<span id="client-snackbar">{message}</span>}
      />
    </Snackbar>
  )
}
