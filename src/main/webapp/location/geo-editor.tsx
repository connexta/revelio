import { geometry, coordinates as coordinateEditor } from 'geospatialdraw'

type BasicEditorProps = {
  value: geometry.GeometryJSON
  onChange: (geo: geometry.GeometryJSON) => void
}

type EditorWithCoordinateUnit = BasicEditorProps & {
  coordinateUnit: coordinateEditor.CoordinateUnit
}

export { BasicEditorProps }

export default EditorWithCoordinateUnit
