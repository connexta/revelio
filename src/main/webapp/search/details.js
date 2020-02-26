import { useQuery } from '@apollo/react-hooks'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import gql from 'graphql-tag'
import { getIn } from 'immutable'
import React from 'react'
import { useParams } from 'react-router-dom'
import Thumbnail from '../components/thumbnail/thumbnail'
import ErrorMessage from '../components/network-retry/inline-retry'

const LoadingComponent = () => <LinearProgress />

const searchByID = gql`
  query SearchByIdDetails($ids: [ID]!) {
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

  const { loading, error, data, refetch } = useQuery(searchByID, {
    variables: { ids: [id] },
  })

  if (loading) {
    return <LoadingComponent />
  }

  if (error) {
    return (
      <ErrorMessage onRetry={refetch} error={error}>
        Error getting details
      </ErrorMessage>
    )
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
