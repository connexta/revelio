import { useQuery } from '@apollo/react-hooks'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Tab from '@material-ui/core/Tab'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import ImageIcon from '@material-ui/icons/Image'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import gql from 'graphql-tag'
import React from 'react'
import ErrorMessage from '../components/network-retry/inline-retry'
import Thumbnail from '../thumbnail/thumbnail'
import Search from './search'
import useSearchRouting, { DetailsLink } from './search-routing'

const LoadingComponent = () => <LinearProgress />

const metacardQuery = gql`
  query TextQuery($filter: Json!, $settings: QuerySettingsInput) {
    metacards(filterTree: $filter, settings: $settings) {
      attributes {
        id
        description
        title
        modified
        thumbnail
      }
      status {
        hits
        elapsed
      }
    }
  }
`

const Paging = props => {
  const { total, startIndex, pageSize, handleRoute } = props

  const handleChangePage = (_, n) => {
    const startIndex = n * pageSize + 1
    handleRoute({ startIndex: startIndex })
  }
  const handleChangeRowsPerPage = e => {
    const size = parseInt(e.target.value, 10)
    handleRoute({ startIndex: 1, pageSize: size })
  }

  return (
    <TablePagination
      component="div"
      rowsPerPageOptions={[15, 50, 100]}
      colSpan={12}
      count={total}
      rowsPerPage={pageSize}
      page={startIndex > pageSize ? (startIndex - 1) / pageSize : 0}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  )
}

const GalleryThumbnail = ({ thumbnail }) => {
  return thumbnail !== undefined ? <Thumbnail src={thumbnail} /> : null
}

const GalleryItem = props => {
  const { result } = props

  return (
    <Grid item xs={3}>
      <DetailsLink id={result.id}>
        <GalleryThumbnail thumbnail={result.thumbnail} />
        <Typography noWrap>{result.title}</Typography>
      </DetailsLink>
    </Grid>
  )
}

const Gallery = ({ results }) => {
  return (
    <Grid container alignItems="flex-end">
      {results.map(result => {
        return <GalleryItem key={result.id} result={result} />
      })}
    </Grid>
  )
}

const ResultTable = ({ results }) => {
  return (
    <Table>
      <TableBody>
        {results.map(result => {
          return (
            <TableRow key={result.id}>
              <TableCell>
                <DetailsLink id={result.id}>
                  <Typography>{result.title}</Typography>
                </DetailsLink>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

const QueryTypes = props => {
  const { type, handleRoute } = props

  const tabRoute = (_, type) => {
    handleRoute({ type: type, startIndex: 1 })
  }

  return (
    <Tabs value={type} onChange={tabRoute} centered>
      <Tab
        label="All"
        icon={<TextFieldsIcon fontSize="small" />}
        value="text"
      />
      <Tab label="Images" icon={<ImageIcon fontSize="small" />} value="image" />
    </Tabs>
  )
}

const ResultsView = props => {
  const { isImageType } = props
  return isImageType ? <Gallery {...props} /> : <ResultTable {...props} />
}

const getQueryFilter = props => {
  const { query = '', isImageType = false } = props

  const filter = {
    type: 'AND',
    filters: [{ type: 'ILIKE', property: 'anyText', value: query }],
  }

  if (isImageType) {
    filter.filters.push({
      type: '=',
      property: 'media.type',
      value: 'image/jpeg',
    })
  }

  return filter
}

const Results = () => {
  const { handleRoute, query, type, startIndex, pageSize } = useSearchRouting()

  const isImageType = type === 'image'

  const { loading, error, data, refetch } = useQuery(metacardQuery, {
    variables: {
      filter: getQueryFilter({ query, isImageType }),
      settings: {
        pageSize,
        startIndex,
      },
    },
  })

  if (loading) {
    return <LoadingComponent />
  }

  if (error) {
    return (
      <ErrorMessage onRetry={refetch} error={error}>
        Error: Query Failed
      </ErrorMessage>
    )
  }

  const { attributes, status } = data.metacards

  const pagingProps = {
    total: status.hits,
    pageSize,
    startIndex,
    handleRoute,
  }

  return (
    <Grid container justify="center" alignItems="center" spacing={2}>
      <Grid item xs={12}>
        <Search initialQuery={query} type={type} />
      </Grid>
      <Grid item xs={9}>
        <QueryTypes type={type} handleRoute={handleRoute} />
      </Grid>

      <Grid item xs={9}>
        <Typography color="textSecondary">
          About {status.hits} results ({status.elapsed}
          ms)
        </Typography>
      </Grid>

      <Grid item xs={9}>
        <ResultsView results={attributes} isImageType={isImageType} />
      </Grid>

      <Grid item xs={9}>
        <Paging {...pagingProps} />
      </Grid>
    </Grid>
  )
}

export default Results
