import { GeometryJSON } from 'geospatialdraw/bin/geometry/geometry'
import { CoordinateUnit } from 'geospatialdraw/bin/coordinates/units'

export type BasicEditorProps = {
  value: GeometryJSON
  onChange: (geo: GeometryJSON) => void
}

type EditorWithCoordinateUnit = BasicEditorProps & {
  coordinateUnit: CoordinateUnit
}

export default EditorWithCoordinateUnit
