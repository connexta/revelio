import * as React from 'react'
const { useApolloFallback } = require('../../react-hooks')
import { ContainerProps, PresentationProps } from './props'
import Keyword from './presentation'
import Container from './container'

export default (props: ContainerProps | PresentationProps) => {
  const Component = useApolloFallback(Container, Keyword)
  return <Component {...props} />
}
