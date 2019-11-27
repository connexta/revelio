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

type Props = BasicEditorProps & {
  placeholder?: string
  minimumInputLength?: number
}

type Suggestion = {
  id: string
  name: string
}

type KeywordGeoProperties = geometry.GeometryJSONProperties & {
  keyword?: string
  keywordId?: number
}

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
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
  const [input, setInput] = React.useState<string>(keyword)
  const [open, setOpen] = React.useState(false)
  const loading =
    open && suggestions.length === 0 && input.length >= minimumInputLength
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
        const response = await fetch(
          `./internal/geofeature/suggestions?q=${input}`
        )
        const json = await response.json()
        if (active) {
          setSuggestions(
            json.filter(
              (suggestion: Suggestion) => !suggestion.id.startsWith('LITERAL')
            )
          )
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
              const response = await fetch(`./internal/geofeature?id=${id}`)
              const json = await response.json()
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
