import * as React from 'react'
import { geometry } from 'geospatialdraw'
import { useLazyQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {
  Suggestion,
  KeywordGeoProperties,
  ContainerProps as Props,
} from './props'
import Keyword from './presentation'

const MINIMUM_INPUT_LENGTH = 2

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

type suggestionResult = {
  suggestions: Suggestion[]
}

type geofeatureResult = {
  geofeature: geometry.GeometryJSON
}

const Container: React.SFC<Props> = ({
  value,
  onChange,
  minimumInputLength = MINIMUM_INPUT_LENGTH,
  ...rest
}) => {
  const {
    keyword = '',
    keywordId = '',
  } = value.properties as KeywordGeoProperties
  const [selectedId, setSelectedId] = React.useState('')
  const [input, setInput] = React.useState(keyword)
  const [isOpen, setIsOpen] = React.useState(false)
  const [
    getFeature,
    {
      data: { geofeature } = { geofeature: value },
      loading: featureLoading,
      error: featureError,
    },
  ] = useLazyQuery<geofeatureResult>(FeatureQuery)
  const [
    getSuggestions,
    {
      data: { suggestions } = { suggestions: [] },
      loading: suggestionLoading,
      error: suggestionError,
    },
  ] = useLazyQuery<suggestionResult>(SuggestionsQuery)
  React.useEffect(
    () => {
      if (selectedId) {
        const geo = geometry.geoJSONToGeometryJSON(geofeature.properties.id, {
          geofeature,
          properties: {
            ...value.properties,
            keyword: input,
            keywordId: selectedId,
          },
        })
        onChange(geo)
      }
    },
    [geofeature.id]
  )
  const loading = suggestionLoading || featureLoading
  const error = suggestionError || featureError ? true : false
  return (
    <Keyword
      value={{
        ...geofeature,
        properties: {
          ...value.properties,
          ...geofeature.properties,
          keyword: input,
          keywordId,
        },
      }}
      onChange={update =>
        onChange({
          ...update,
          properties: {
            ...update.properties,
            keyword,
          },
        })
      }
      getGeoFeature={({ id, name }) => {
        setInput(name)
        setSelectedId(id)
        getFeature({
          variables: {
            id,
          },
        })
      }}
      getSuggestions={q => {
        setInput(q)
        getSuggestions({
          variables: {
            q,
          },
        })
      }}
      loading={loading}
      error={error}
      suggestions={isOpen ? suggestions : []}
      isOpen={isOpen}
      onOpen={() => {
        setIsOpen(true)
      }}
      onClose={() => {
        setIsOpen(false)
        if (keyword && keyword !== input) {
          setInput(keyword)
        }
      }}
      {...rest}
    />
  )
}

export default Container
