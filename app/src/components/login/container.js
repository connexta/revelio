import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import LogIn from './login'
import { useApolloFallback } from '../../react-hooks'
import cookies from '../../cookies'
const useLogin = () => {
  const LOGIN_MUTATION = gql`
    mutation LogIn($username: String!, $password: String!) {
      logIn(username: $username, password: $password)
    }
  `
  return useMutation(LOGIN_MUTATION)
}

const Container = props => {
  const [login] = useLogin()
  const executeLogin = async (username, password) => {
    try {
      const { data } = await login({ variables: { username, password } })
      cookies.set('RSESSION', data.logIn, { path: '/' })
      return true
    } catch (error) {
      return false
    }
  }
  return <LogIn label={props.label} login={executeLogin} />
}

export default props => {
  const Component = useApolloFallback(Container, LogIn)
  return <Component {...props} />
}
