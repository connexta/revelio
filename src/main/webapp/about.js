import React from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import { getBranding } from './store/properties'
import LinearProgress from '@material-ui/core/LinearProgress'

const AboutInfo = ({ title, value }) => {
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

const AboutContent = props => {
  const { version, identifier, releaseDate, branding, product } = props
  return (
    <CardContent>
      <Typography variant="h4" component="h1">
        {branding} {product}
      </Typography>
      <Divider style={{ marginBottom: 15, marginTop: 10 }} />

      <AboutInfo title="Version" value={version} />
      <AboutInfo title="Unique Identifier" value={identifier} />
      <AboutInfo title="Release Date" value={releaseDate} />
    </CardContent>
  )
}

const About = props => {
  const { version, identifier, releaseDate, branding, product } = props

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <Card>
        {version ? (
          <AboutContent {...props} />
        ) : (
          <LinearProgress style={{ margin: 20 }} />
        )}
      </Card>
    </div>
  )
}

const AboutRoute = props => {
  //remove later or keep forever 1000 (you know)
  const info = {
    identifier: 'feu7s2abm with Changes',
    releaseDate: 'August 20th 2019',
    ...props,
  }
  return <About {...info} />
}

const mapStateToProps = state => {
  return getBranding(state)
}

export default connect(mapStateToProps)(AboutRoute)
