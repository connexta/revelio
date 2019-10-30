import FormControl from '@material-ui/core/FormControl'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import { Map } from 'immutable'
import React from 'react'

const SearchSettings = (props = {}) => {
  const { value = Map(), systemProperties = {} } = props
  const [resultCount, setResultCount] = React.useState(value.get('resultCount'))

  const onChange = (_, newValue) => {
    setResultCount(newValue)
    props.onChange(value.set('resultCount', newValue))
  }

  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <Typography>Number of Search Results</Typography>
      <Typography>{resultCount}</Typography>
      <Slider
        max={systemProperties.resultCount}
        defaultValue={systemProperties.resultCount}
        value={resultCount}
        onChange={onChange}
      />
    </FormControl>
  )
}

export default SearchSettings
