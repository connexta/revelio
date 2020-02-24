import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useState } from 'react'
import { ApolloError } from 'apollo-client/errors/ApolloError'
import { hasIgnorable } from './utils'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.error.main,
  },
}))

type ErrorMessageProps = {
  children?: React.ReactNode | string
  onRetry?: () => void
  error?: ApolloError
}

type CardProps = {
  children: React.ReactNode
  onRetry?: () => void
}

const ErrorCard = (props: CardProps) => {
  const [loading, setLoading] = useState(false)
  const classes = useStyles()
  return (
    <Paper className={classes.root} style={{ padding: 20 }}>
      <Box
        display="flex"
        style={{ width: '100%', height: '100%' }}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {props.children}
        <Box style={{ marginTop: 20 }}>
          {props.onRetry !== undefined &&
            !loading && (
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  setLoading(true)
                  try {
                    if (props.onRetry) {
                      await props.onRetry()
                    }
                  } catch (e) {
                    //eslint-disable-next-line
                    console.log(e)
                  }
                  setLoading(false)
                }}
              >
                Retry?
              </Button>
            )}
          {loading && <CircularProgress />}
        </Box>
      </Box>
    </Paper>
  )
}

const ErrorMessage = (props: ErrorMessageProps) => {
  let Component
  if (typeof props.children === 'string' || props.children === undefined) {
    Component = (
      <Box
        display="flex"
        style={{ width: '100%', height: '100%' }}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        {props.children || 'Error'}
      </Box>
    )
  } else {
    Component = props.children
  }

  const displayCard =
    !props.error || (props.error && !hasIgnorable(props.error))

  return displayCard ? (
    <ErrorCard onRetry={props.onRetry}>{Component}</ErrorCard>
  ) : null
}

export default ErrorMessage
