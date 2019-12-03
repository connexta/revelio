import * as React from 'react'
import {
  geometry,
  shapes,
  coordinates as coordinateEditor,
} from 'geospatialdraw'
import { BasicEditorProps } from './geo-editor'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import Length from './length'
import SpacedLinearContainer from '../spaced-linear-container'
import { useQuery } from '@apollo/react-hooks'
// const { SUGGESTION_QUERY, FEATURE_QUERY } = require('./keyword-queries')
import gql from 'graphql-tag'

const SuggestionsQuery = gql`
  query SuggestionsQuery($q: String!) {
    suggestions(q: $q) {
      id
      name
    }
  }
`

// const FeatureQuery = gql`
//   query FeatureQuery($id: String!) {
//     geofeature(id: $id) {
//       type
//       geometry
//       properties
//       id
//     }
//   }
// `

type Props = BasicEditorProps & {
  placeholder?: string
  minimumInputLength?: number
}

type Suggestion = {
  id: string
  name: string
}

type SelectedKeyword = {
  keyword?: string
  keywordId?: number
}

type KeywordGeoProperties = geometry.GeometryJSONProperties & SelectedKeyword

const MINIMUM_INPUT_LENGTH = 2

const Keyword: React.SFC<Props> = ({
  value,
  onChange,
  placeholder = 'Pan to a region, country, or city',
  minimumInputLength = MINIMUM_INPUT_LENGTH,
}) => {
  const {
    id,
    properties,
    coordinates,
    buffer,
    bufferUnit,
  } = coordinateEditor.geoToPolygonProps(value)
  const { keyword = '', keywordId, color } = properties as KeywordGeoProperties
  const hasSelection = keyword && keywordId ? true : false
  const [input, setInput] = React.useState<string>(keyword)
  const [open, setOpen] = React.useState(false)
  const [selectedKeyword, setSelectedKeyword] = React.useState<SelectedKeyword>(
    {}
  )
  // const loading =
  //   open && suggestions.length === 0 && input.length >= minimumInputLength
  const { data: suggestions, loading: suggestionLoading } = useQuery(SuggestionsQuery, {
    variables: {
      q: 'italy',
    },
  })
  const loadSuggestions = () => {}
  // const [
  //   loadFeature,
  //   { data: geoFeature, loading: featureLoading },
  // ] = useLazyQuery(FeatureQuery, {
  //   variables: {
  //     id: selectedKeyword.keywordId || '',
  //   },
  // })
  const loadFeature = () => {}
  const geoFeature = {id:''}
  const featureLoading = false
  const loading = suggestionLoading || featureLoading
  React.useEffect(
    () => {
      if (keyword !== input) {
        setInput(keyword)
      }
    },
    [keyword]
  )
  React.useEffect(
    () => {
      if (input.length >= minimumInputLength) {
        loadSuggestions()
      }
    },
    [input]
  )
  React.useEffect(
    () => {
      loadFeature()
    },
    [selectedKeyword.keyword, selectedKeyword.keywordId]
  )
  React.useEffect(
    () => {
      if (geoFeature && selectedKeyword.keyword === geoFeature.id) {
        const geo = geometry.makeGeometry(id, geoFeature, color, shapes.POLYGON)
        geo.properties.keyword = name
        geo.properties.keywordId = keywordId
        onChange(geo)
      }
    },
    [geoFeature, selectedKeyword.keyword]
  )
  return (
    <SpacedLinearContainer direction="column" spacing={1}>
      <Autocomplete
        title={placeholder}
        style={{ width: 300 }}
        open={open}
        onOpen={() => {
          setOpen(true)
        }}
        onClose={() => {
          setOpen(false)
          if (keyword !== input) {
            onChange(geometry.makeEmptyGeometry(id, shapes.POLYGON))
          }
        }}
        getOptionLabel={(suggestion: Suggestion) => suggestion.name}
        options={suggestions}
        loading={loading}
        inputValue={input}
        onChange={(_e, value) => {
          if (value) {
            const { id: keywordId, name: keyword } = value
            setSelectedKeyword({
              keywordId,
              keyword,
            })
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            helperText={open || hasSelection ? undefined : placeholder}
            label="Keyword"
            placeholder={`Please enter ${minimumInputLength} or more characters`}
            fullWidth
            onChange={e => {
              setInput(e.target.value)
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
