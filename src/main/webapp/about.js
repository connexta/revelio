import React from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import { getBranding } from './store/properties'

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

const About = props => {
  const { version, identifier, releaseDate, branding, appName } = props
  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1">
            {branding} {appName}
          </Typography>
          <Divider style={{ marginBottom: 15, marginTop: 10 }} />

          <AboutInfo title="Version" value={version} />
          <AboutInfo title="Unique Identifier" value={identifier} />
          <AboutInfo title="Release Date" value={releaseDate} />
        </CardContent>
      </Card>
    </div>
  )
}

const AboutRoute = props => {
  //remove later or keep forever 1000 (you know)
  const info = {
    branding: 'DDF',
    appName: 'Intrigue',
    version: '2.18.0-SNAPSHOT',
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
