import * as React from 'react'
import { coordinates as coordinateEditor } from 'geospatialdraw'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import Length from '../length'
import SpacedLinearContainer from '../../spaced-linear-container'
import {
  Suggestion,
  PresentationProps as Props,
  KeywordGeoProperties,
} from './props'

const Keyword: React.SFC<Props> = ({
  value,
  onChange,
  placeholder = 'Pan to a region, country, or city',
  minimumInputLength,
  getSuggestions,
  getGeoFeature,
  loading,
  error,
  suggestions,
  isOpen,
  onOpen,
  onClose,
}) => {
  const {
    id,
    properties,
    coordinates,
    buffer,
    bufferUnit,
  } = coordinateEditor.geoToPolygonProps(value)
  const { keyword = '', keywordId } = properties as KeywordGeoProperties
  const hasSelection = keyword && keywordId ? true : false
  return (
    <SpacedLinearContainer direction="column" spacing={1}>
      <Autocomplete
        title={placeholder}
        style={{ width: 300 }}
        open={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        getOptionLabel={(suggestion: Suggestion) => suggestion.name}
        options={suggestions}
        loading={loading}
        inputValue={keyword}
        onChange={(_e, value) => {
          if (value) {
            const { id, name } = value
            getGeoFeature({ id, name })
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            error={error}
            helperText={open || hasSelection ? undefined : placeholder}
            label="Keyword"
            placeholder={`Please enter ${minimumInputLength} or more characters`}
            fullWidth
            onChange={e => {
              getSuggestions(e.target.value)
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      {hasSelection ? (
        <Length
          label="Buffer"
          value={{ length: buffer, unit: bufferUnit }}
          onChange={({ length, unit }) =>
            onChange(
              coordinateEditor.polygonPropsToGeo({
                id,
                coordinates,
                buffer: length,
                bufferUnit: unit,
                properties,
              })
            )
          }
        />
      ) : null}
    </SpacedLinearContainer>
  )
}

export default Keyword
