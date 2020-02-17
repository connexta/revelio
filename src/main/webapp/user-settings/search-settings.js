import FormControl from '@material-ui/core/FormControl'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import { get, getIn, Map, set, setIn, merge } from 'immutable'
import React from 'react'
import SortOrder from '../sort-order'
import ResultFormSelect from './result-form-select'
import SourceSelect from './source-select'

const Spacing = () => <div style={{ marginTop: 20 }} />
const Defaults = props => (
  <React.Fragment>
    <Spacing />
    <Typography variant="h6" component="h2">
      Defaults
    </Typography>

    <SortOrder
      value={getIn(props.value, ['querySettings', 'sortPolicy'])}
      onChange={sortOrder =>
        props.onChange(
          setIn(props.value, ['querySettings', 'sortPolicy'], sortOrder)
        )
      }
    />
    <Spacing />
    <SourceSelect
      value={getIn(props.value, ['querySettings', 'sourceIds'])}
      onChange={newValue => {
        const querySettings = merge(get(props.value, 'querySettings'), {
          federation: newValue !== null ? 'selected' : 'enterprise',
          sourceIds: [newValue],
        })

        props.onChange(set(props.value, 'querySettings', querySettings))
      }}
    />
    <Spacing />
    <ResultFormSelect
      value={getIn(props.value, ['querySettings', 'detail_level'])}
      onChange={newValue =>
        props.onChange(
          setIn(props.value, ['querySettings', 'detail_level'], newValue)
        )
      }
    />
  </React.Fragment>
)

const SearchSettings = (props = {}) => {
  const { value = Map(), systemProperties = {}, onChange } = props
  const resultCount = get(value, 'resultCount')

  const onSliderChange = (_, newValue) => {
    onChange(set(value, 'resultCount', newValue))
  }

  return (
    <React.Fragment>
      <FormControl fullWidth variant="outlined" margin="normal">
        <Typography>Number of Search Results</Typography>
        <Typography>{resultCount}</Typography>
        <Slider
          max={systemProperties.resultCount}
          defaultValue={systemProperties.resultCount}
          value={resultCount}
          onChange={onSliderChange}
        />
      </FormControl>
      <Defaults value={value} onChange={props.onChange} />
    </React.Fragment>
  )
}

export default SearchSettings
