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
import { useLazyQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
const { useApolloFallback } = require('../react-hooks')

const SuggestionsQuery = gql`
  query SuggestionsQuery($q: String!) {
    suggestions(q: $q) {
      id
      name
    }
  }
`

const FeatureQuery = gql`
  query FeatureQuery($id: String!) {
    geofeature(id: $id) {
      type
      geometry
      properties
      id
    }
  }
`

type ContainerProps = BasicEditorProps & {
  placeholder?: string
  minimumInputLength?: number
}

type Props = ContainerProps & {
  getSuggestions: (q: string) => Promise<Suggestion[]>
  getGeoFeature: (id: string) => Promise<geometry.GeometryJSON>
  loading: boolean
  error: boolean
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
  getSuggestions,
  getGeoFeature,
  loading,
  error,
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
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
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
      let active = true
      if (input.length < minimumInputLength) {
        if (suggestions.length > 0) {
          setSuggestions([])
        }
        return undefined
      }
      ;(async () => {
        const results = await getSuggestions(input)
        if (active) {
          setSuggestions(results)
        }
      })()
      return () => {
        active = false
      }
    },
    [input]
  )
  React.useEffect(
    () => {
      if (!open) {
        setSuggestions([])
      }
    },
    [open]
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
            const { id: keywordId, name } = value
            ;(async () => {
              const json = await getGeoFeature(keywordId)
              const geo = geometry.makeGeometry(id, json, color, shapes.POLYGON)
              geo.properties.keyword = name
              geo.properties.keywordId = keywordId
              onChange(geo)
            })()
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

const Container: React.SFC<BasicEditorProps> = props => {
  let q = ''
  let id = ''
  const [
    loadSuggestions,
    { data: suggestions, loading: suggestionLoading, error: suggestionError },
  ] = useLazyQuery(SuggestionsQuery, {
    variables: {
      q,
    },
  })
  const [
    loadFeature,
    { data: feature, loading: featureLoading, error: featureError },
  ] = useLazyQuery(FeatureQuery, {
    variables: {
      id,
    },
  })
  const getGeoFeature = async (value: string) => {
    id = value
    loadFeature()
    const results = await feature
    return results
  }
  const getSuggestions = async (value: string) => {
    q = value
    loadSuggestions()
    const results = await suggestions
    return results
  }
  const loading = suggestionLoading || featureLoading
  const error = suggestionError || featureError ? true : false
  return (
    <Keyword
      getGeoFeature={getGeoFeature}
      getSuggestions={getSuggestions}
      loading={loading}
      error={error}
      {...props}
    />
  )
}

export default (props: BasicEditorProps | Props) => {
  const Component = useApolloFallback(Container, Keyword)
  return <Component {...props} />
}
