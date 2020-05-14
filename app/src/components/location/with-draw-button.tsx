import * as React from 'react'
const { useDrawInterface } = require('../../react-hooks')
import { Shape } from 'geospatialdraw/bin/shapes/shape'
import useGeometryJSONMemo from 'geospatialdraw/bin/geometry/memo'
import { GeometryJSON } from 'geospatialdraw/bin/geometry/geometry'
import { BasicEditorProps } from './geo-editor'
import { SpacedLinearContainer } from '../containers'
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
  shape: Shape
): OutputComponent => ({ value, onChange }) => {
  const [drawState, setDrawState] = useDrawInterface()
  const onDraw = () => {
    setDrawState({
      geo: value,
      active: true,
      shape,
    })
  }
  const memo = useGeometryJSONMemo(drawState.geo)
  React.useEffect(() => {
    const geo =
      drawState.geo === null
        ? null
        : {
            ...drawState.geo,
            properties: {
              ...drawState.geo.properties,
              id: drawState.geo.properties.id || value.properties.id,
            },
          }
    if (geo && geo.properties.id === value.properties.id) {
      onChange(geo)
    }
  }, [memo])
  const editorOnChange = (geo: GeometryJSON) => {
    setDrawState({
      geo,
      active: drawState.active,
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
