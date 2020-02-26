import { BasicEditorProps } from '../geo-editor'
import {
  GeometryJSON,
  GeometryJSONProperties,
} from 'geospatialdraw/bin/geometry/geometry'

export type Suggestion = {
  id: string
  name: string
}

export type queryHook<DataType, QueryParams> = () => {
  fetch: (q: QueryParams) => void
  data: DataType
  loading: boolean
  error: boolean
}

export type KeywordProps = BasicEditorProps & {
  placeholder?: string
  minimumInputLength?: number
}

export type ContainerProps = KeywordProps & {
  useFeatureQuery: queryHook<GeometryJSON, string>
  useSuggestionQuery: queryHook<Suggestion[], string>
}

export type PresentationProps = KeywordProps & {
  getSuggestions: (q: string) => void
  getGeoFeature: (suggestion: Suggestion) => void
  loading: boolean
  error: boolean
  suggestions: Suggestion[]
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

type SelectedKeyword = {
  keyword?: string
  keywordId?: string
}

export type KeywordGeoProperties = GeometryJSONProperties & SelectedKeyword
