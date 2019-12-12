import * as React from 'react'
import { geometry } from 'geospatialdraw'
import {
  KeywordGeoProperties,
  ContainerProps as Props,
  Suggestion,
} from './props'
import Keyword from './presentation'

const MINIMUM_INPUT_LENGTH = 2

const Container: React.SFC<Props> = ({
  value,
  onChange,
  minimumInputLength = MINIMUM_INPUT_LENGTH,
  useFeatureQuery,
  useSuggestionQuery,
  ...rest
}) => {
  const {
    keyword = '',
    keywordId = '',
  } = value.properties as KeywordGeoProperties
  const [selectedSuggestion, setSelectedSuggestion] = React.useState<
    Suggestion
  >({ name: '', id: '' })
  const [input, setInput] = React.useState(keyword)
  const [isOpen, setIsOpen] = React.useState(false)
  const {
    fetch: getFeature,
    data: geofeature,
    loading: featureLoading,
    error: featureError,
  } = useFeatureQuery()
  const {
    fetch: getSuggestions,
    data: suggestions,
    loading: suggestionLoading,
    error: suggestionError,
  } = useSuggestionQuery()
  React.useEffect(
    () => {
      if (selectedSuggestion.id && !featureLoading) {
        const geo = geometry.geoJSONToGeometryJSON(value.properties.id, {
          ...geofeature,
          properties: {
            ...value.properties,
            keyword: selectedSuggestion.name,
            keywordId: selectedSuggestion.id,
          },
        })
        setInput(selectedSuggestion.name)
        onChange(geo)
      }
    },
    [selectedSuggestion.id, selectedSuggestion.name, featureLoading]
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
      getGeoFeature={suggestion => {
        getFeature(suggestion.id)
        setSelectedSuggestion(suggestion)
      }}
      getSuggestions={q => {
        setInput(q)
        if (q.length >= minimumInputLength) {
          getSuggestions(q)
        }
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
        if (selectedSuggestion.id) {
          if (selectedSuggestion.name !== input) {
            setInput(selectedSuggestion.name)
          }
        } else if (keyword && keyword !== input) {
          setInput(keyword)
        }
      }}
      {...rest}
    />
  )
}
Container.displayName = 'KeywordContainer'

export default Container
