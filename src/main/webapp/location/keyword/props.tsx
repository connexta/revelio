import { BasicEditorProps } from '../geo-editor'
import { geometry } from 'geospatialdraw'

export type Suggestion = {
  id: string
  name: string
}

export type ContainerProps = BasicEditorProps & {
  placeholder?: string
  minimumInputLength?: number
}

export type PresentationProps = ContainerProps & {
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

export type KeywordGeoProperties = geometry.GeometryJSONProperties &
  SelectedKeyword
