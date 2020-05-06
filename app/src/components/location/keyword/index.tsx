import * as React from 'react'
const { useApolloFallback } = require('../../../react-hooks')
import { ContainerProps, PresentationProps } from './props'
import Container from './container'
import withRemoteQueries from './with-remote-queries'

export default (props: ContainerProps | PresentationProps) => {
  const Component = useApolloFallback(withRemoteQueries(Container), Container)
  return <Component {...props} />
}
