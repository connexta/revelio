import * as React from 'react'
const { useDrawInterface } = require('../react-hooks')
import { shapes } from 'geospatialdraw'
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
      const { geo, shape: drawnShape } = drawState
      if (
        geo &&
        geo.properties.id === value.id &&
        shape === drawnShape &&
        JSON.stringify(geo) !== JSON.stringify(value)
      ) {
        onChange(geo)
      }
    },
    [drawState]
  )
  return (
    <SpacedLinearContainer direction="column" spacing={1}>
      <Editor value={value} onChange={onChange} />
      <DrawButton onDraw={onDraw} active={drawState.active} />
    </SpacedLinearContainer>
  )
}

export default withDrawButton
