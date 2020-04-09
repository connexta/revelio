import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import LinearProgress from '@material-ui/core/LinearProgress'
import ErrorMessage from '../network-retry/inline-retry'
import { useApolloFallback } from '../../react-hooks'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import FormLabel from '@material-ui/core/FormLabel'

const getExportOptions = gql`
  query ExportOptions($transformerType: String!) {
    exportOptions(transformerType: $transformerType) {
      id
      displayName
    }
  }
`

export const Container = props => {
  const { loading, error, data, refetch } = useQuery(getExportOptions, {
    variables: { transformerType: 'metacard' },
  })
  if (loading) {
    return <LinearProgress />
  }
  if (error) {
    return (
      <ErrorMessage onRetry={refetch} error={error}>
        Error getting export formats
      </ErrorMessage>
    )
  }
  const exportFormats = data.exportOptions

  return (
    <ResultExport
      exportFormats={exportFormats}
      handleClose={props.handleClose}
    />
  )
}

const ResultExport = props => {
  const { exportFormats } = props
  const [selectedFormat, setSelectedFormat] = React.useState('')
  const handleFormatChange = event => {
    setSelectedFormat(event.target.value)
  }
  return (
    <React.Fragment>
      <FormLabel style={{ paddingBottom: '30px' }}>Export Format:</FormLabel>
      <TextField
        fullWidth
        select
        variant="outlined"
        label={selectedFormat === '' ? 'Select an export option' : ''}
        value={selectedFormat}
        style={{ marginBottom: '10px', marginTop: '10px' }}
        onChange={handleFormatChange}
      >
        {exportFormats.map((format, index) => {
          return (
            <MenuItem key={index} value={format.displayName}>
              <ListItemText primary={format.displayName} />
            </MenuItem>
          )
        })}
      </TextField>
      <Button
        fullWidth
        onClick={() => {
          props.handleClose()
        }}
        color="primary"
        variant="contained"
        style={{ marginBottom: '10px' }}
      >
        Download
      </Button>
    </React.Fragment>
  )
}
