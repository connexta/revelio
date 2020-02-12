import React from 'react'
import { useParams } from 'react-router-dom'
import { getIn } from 'immutable'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'

import Thumbnail from '../thumbnail/thumbnail'

const LoadingComponent = () => <LinearProgress />

const searchByID = gql`
  query SearchByID($ids: [ID]!) {
    metacardsById(ids: $ids) {
      attributes {
        id
        description
        title
        modified
        thumbnail
      }
    }
  }
`

const Details = () => {
  const { id } = useParams()

  const { loading, error, data } = useQuery(searchByID, {
    variables: { ids: [id] },
  })

  if (loading) {
    return <LoadingComponent />
  }

  if (error) {
    return <Typography>Error getting details</Typography>
  }

  const attributes = getIn(
    data,
    ['metacardsById', 0, 'attributes', 0],
    'missing'
  )

  if (attributes === 'missing') {
    return <Typography>Details missing from response</Typography>
  }

  return (
    <Container maxWidth="md" style={{ marginTop: 20 }}>
      <Paper>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography variant={'h4'} noWrap>
              {attributes.title}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Thumbnail src={attributes.thumbnail} />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Details
