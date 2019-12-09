import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormLabel from '@material-ui/core/FormLabel'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

export const logIn = () => {
  const mutation = gql`
    mutation LogIn($username: String!, $password: String!) {
      logIn(userName: $username, password: $password)
    }
  `
  return useMutation(mutation)
}

export const LogIn = props => {
  const [logIn] = logIn()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        padding: 20,
        boxSizing: 'border-box',
        ...props.style,
      }}
    >
      <FormLabel style={{ padding: 10 }}>{props.label}</FormLabel>
      <TextField
        autoFocus
        required
        fullWidth
        label="Username"
        variant="outlined"
        style={{ marginBottom: 20 }}
      />
      <TextField
        required
        fullwidth
        label="Password"
        variant="outlined"
        type="password"
        style={{ marginBottom: 20 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          //TO:DO parse cookie from gql query and set it
        }}
      >
        Log In
      </Button>
    </div>
  )
}

export default LogIn
