import React from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
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
const useExportMutation = () => {
  const exportMutation = gql`
    mutation ExportResult($source: String!, $id: ID!, $transformer: String!) {
      exportResult(source: $source, id: $id, transformer: $transformer)
    }
  `
  return useMutation(exportMutation)
}

const Container = props => {
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
      {...props}
      exportFormats={exportFormats}
      handleClose={props.handleClose}
    />
  )
}

const ResultExport = props => {
  const [exportResultHook] = useExportMutation()
  const { exportFormats } = props
  const [selectedFormat, setSelectedFormat] = React.useState('')
  const handleFormatChange = event => {
    setSelectedFormat(event.target.value)
  }

  const getExportFormatId = format => {
    const formatToExport = exportFormats.find(
      form => form.displayName === format
    )
    return formatToExport ? encodeURIComponent(formatToExport.id) : undefined
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
        disabled={selectedFormat === '' ? true : false}
        fullWidth
        onClick={async () => {
          const result = props.result
          const encodedTransformer = getExportFormatId(selectedFormat)
          const res = await exportResultHook({
            variables: {
              source: result.sourceId,
              id: result.attributes.id,
              transformer: encodedTransformer,
            },
          })
          const { fileName, type, response } = res.data.exportResult
          const blob = new Blob([response.body], { type: 'data:' + type })
          const url = window.URL.createObjectURL(blob)
          let downloadLink = document.createElement('a')
          downloadLink.href = url
          downloadLink.setAttribute('download', fileName)
          downloadLink.click()
          window.URL.revokeObjectURL(url)
          downloadLink.remove()
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

export default props => {
  const Component = useApolloFallback(Container, ResultExport)
  return <Component {...props} />
}
