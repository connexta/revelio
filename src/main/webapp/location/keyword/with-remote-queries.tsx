import * as React from 'react'
import { GeometryJSON } from 'geospatialdraw/bin/geometry/geometry'
import { useLazyQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {
  Suggestion,
  KeywordProps as Props,
  ContainerProps,
  queryHook,
} from './props'

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
  geofeature: GeometryJSON
}

const withRemoteQueries = (
  Component: React.ComponentType<ContainerProps>
): React.SFC<Props> => ({ value, ...rest }) => {
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
  const useFeatureQuery: queryHook<GeometryJSON, string> = () => ({
    fetch: id =>
      getFeature({
        variables: {
          id,
        },
      }),
    data: geofeature,
    loading: featureLoading,
    error: featureError ? true : false,
  })
  const useSuggestionQuery: queryHook<Suggestion[], string> = () => ({
    fetch: q =>
      getSuggestions({
        variables: {
          q,
        },
      }),
    data: suggestions,
    loading: suggestionLoading,
    error: suggestionError ? true : false,
  })
  return (
    <Component
      useFeatureQuery={useFeatureQuery}
      useSuggestionQuery={useSuggestionQuery}
      value={value}
      {...rest}
    />
  )
}

export default withRemoteQueries
