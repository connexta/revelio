import { geometry, coordinates as coordinateEditor } from 'geospatialdraw'

type Props = {
  geo: geometry.GeometryJSON
  onChange: (geo: geometry.GeometryJSON) => void
  coordinateUnit: coordinateEditor.CoordinateUnit
}

export default Props
