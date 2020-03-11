import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import LinearProgress from '@material-ui/core/LinearProgress'

const Info = ({ title, value }) => {
  return (
    <React.Fragment>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      <Typography color="textSecondary" gutterBottom>
        {value}
      </Typography>
    </React.Fragment>
  )
}

const Content = props => {
  const { version, identifier, releaseDate, branding, product } = props
  return (
    <CardContent>
      <Typography variant="h4" component="h1">
        {branding} {product} bye from link
      </Typography>
      <Divider style={{ marginBottom: 15, marginTop: 10 }} />

      <Info title="Version" value={version} />
      <Info title="Unique Identifier" value={identifier} />
      <Info title="Release Date" value={releaseDate} />
    </CardContent>
  )
}

const Failure = ({ error, onFetchProperties }) => {
  return (
    <React.Fragment>
      <CardContent>
        <Info title="Error" value={error} />
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={onFetchProperties}>
          Refresh
        </Button>
      </CardActions>
    </React.Fragment>
  )
}

const Loading = () => {
  return (
    <CardContent>
      <LinearProgress />
    </CardContent>
  )
}

const Component = props => {
  const { error, attributes } = props
  if (typeof error === 'string') {
    return <Failure {...props} />
  }
  if (attributes !== null && typeof attributes === 'object') {
    return <Content {...attributes} />
  }
  return <Loading />
}

export const About = props => {
  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <Card>
        <Component {...props} />
      </Card>
    </div>
  )
}

const query = gql`
  query AboutPage {
    systemProperties {
      product
      branding
      identifier
      version
      releaseDate
    }
  }
`

export default () => {
  const { error, data = {} } = useQuery(query)
  const attributes = data.systemProperties
  const props = { error, attributes }

  return <About {...props} />
}
