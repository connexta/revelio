import { geometry } from 'geospatialdraw'

type Props = {
  geo: geometry.GeometryJSON
  onChange: (geo: geometry.GeometryJSON) => void
}

export default Props
