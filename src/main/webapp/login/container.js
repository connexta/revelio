import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import Cookies from 'universal-cookie'
import LogIn from './login'
import { useApolloFallback } from '../react-hooks'

const cookies = new Cookies()
const useLogin = () => {
  const LOGIN_MUTATION = gql`
    mutation LogIn($username: String!, $password: String!) {
      logIn(username: $username, password: $password)
    }
  `
  return useMutation(LOGIN_MUTATION)
}

const setCookie = cookie => {
  let parsedCookie = cookie.split(';')
  parsedCookie = parsedCookie[0].split('=')
  cookies.set(parsedCookie[0], parsedCookie[1], { path: '/' })
}

const Container = props => {
  const [login] = useLogin()
  const executeLogin = async (username, password) => {
    const { data } = await login({ variables: { username, password } })
    setCookie(data.logIn)
  }
  return (
    <LogIn
      label={props.label}
      login={executeLogin}
      handleClose={props.handleClose}
    />
  )
}

export default props => {
  const Component = useApolloFallback(Container, LogIn)
  return <Component {...props} />
}
