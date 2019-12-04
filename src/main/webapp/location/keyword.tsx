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
import { useApolloClient } from '@apollo/react-hooks'
import { ApolloQueryResult } from 'apollo-client'
import gql from 'graphql-tag'
const { useApolloFallback } = require('../react-hooks')

type QueryState = 'idle' | 'loading' | 'error'

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
  keywordId?: string
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
  const [selectedKeyword, setSelectedKeyword] = React.useState<SelectedKeyword>(
    {}
  )
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
  React.useEffect(
    () => {
      let active = true
      const { keyword, keywordId } = selectedKeyword
      if (!keyword || !keywordId) {
        return undefined
      }
      ;(async () => {
        const json = await getGeoFeature(keywordId)
        const geo = geometry.makeGeometry(id, json, color, shapes.POLYGON)
        geo.properties.keyword = name
        geo.properties.keywordId = keywordId
        if (active) {
          onChange(geo)
        }
      })()
      return () => {
        active = false
      }
    },
    [selectedKeyword.keyword, selectedKeyword.keywordId]
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
            setSelectedKeyword({ keywordId, keyword })
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

const runQuery = async <T extends {}>(
  promise: Promise<ApolloQueryResult<T>>,
  setState: (v: QueryState) => void
): Promise<T> => {
  setState('loading')
  let isError = false
  try {
    const result = await promise
    return result.data
  } catch (e) {
    setState('error')
    isError = false
    throw e
  } finally {
    if (!isError) {
      setState('idle')
    }
  }
}

type suggestionResult = {
  suggestions: Suggestion[]
}

type geofeatureResult = {
  geofeature: geometry.GeometryJSON
}

const Container: React.SFC<BasicEditorProps> = props => {
  const client = useApolloClient()
  const [featureQueryState, setFeatureQueryState] = React.useState<QueryState>(
    'idle'
  )
  const [suggestionQueryState, setSuggestionQueryState] = React.useState<
    QueryState
  >('idle')
  const getGeoFeature = async (id: string) => {
    return runQuery(
      client.query<geofeatureResult>({
        query: FeatureQuery,
        variables: {
          id,
        },
      }),
      setFeatureQueryState
    ).then(r => r.geofeature)
  }
  const getSuggestions = async (q: string) => {
    return runQuery(
      client.query<suggestionResult>({
        query: SuggestionsQuery,
        variables: {
          q,
        },
      }),
      setSuggestionQueryState
    ).then(r =>
      r.suggestions.filter(suggestion => !suggestion.id.startsWith('LITERAL'))
    )
  }
  const loading =
    suggestionQueryState === 'loading' || featureQueryState === 'loading'
  const error =
    suggestionQueryState === 'error' || featureQueryState === 'error'
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
