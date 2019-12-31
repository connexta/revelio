import * as React from 'react'
const { useDrawInterface } = require('../react-hooks')
import { geometry, shapes } from 'geospatialdraw'
import { BasicEditorProps } from './geo-editor'
import SpacedLinearContainer from '../spaced-linear-container'
import Button from '@material-ui/core/Button'

type OutputComponent = React.SFC<BasicEditorProps>
type EditorComponent = React.ComponentType<BasicEditorProps>
type DrawButtonProps = {
  onDraw: () => void
  active: boolean
}

const DrawButton: React.SFC<DrawButtonProps> = ({ onDraw, active }) => (
  <Button
    fullWidth
    variant="contained"
    color="primary"
    onClick={onDraw}
    title="Draw Geometry On Map"
    disabled={active}
  >
    Draw
  </Button>
)

const withDrawButton = (
  Editor: EditorComponent,
  shape: shapes.Shape
): OutputComponent => ({ value, onChange }) => {
  const [drawState, setDrawState] = useDrawInterface()
  const onDraw = () => {
    setDrawState({
      geo: value,
      active: true,
      shape,
    })
  }
  React.useEffect(
    () => {
      const geo = drawState.geo === null ? null : {
        ...drawState.geo,
        properties: {
          ...drawState.geo.properties,
          id: drawState.geo.properties.id || value.properties.id
        }
      }
      if (
        geo &&
        geo.properties.id === value.properties.id &&
        JSON.stringify(geo) !== JSON.stringify(value)
      ) {
        onChange(geo)
      }
    },
    [drawState]
  )
  const editorOnChange = (geo:geometry.GeometryJSON) => {
    setDrawState({
      geo,
      active: true,
      shape,
    })
    onChange(geo)
  }
  return (
    <SpacedLinearContainer direction="column" spacing={1}>
      <Editor value={value} onChange={editorOnChange} />
      <DrawButton onDraw={onDraw} active={drawState.active} />
    </SpacedLinearContainer>
  )
}

export default withDrawButton
