import * as React from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Line from './line'
import Polygon from './polygon'
import PointRadius from './point-radius'
import BBox from './bbox'
import withCoordinateUnitTabs from './with-coordinate-unit-tabs'
import withDrawButton from './with-draw-button'
import Keyword from './keyword'
import { BasicEditorProps } from './geo-editor'
import { geometry, shapes } from 'geospatialdraw'

type LocationType = 'line' | 'polygon' | 'pointRadius' | 'bbox' | 'keyword'

type LocationTypeComponentMap = {
  [type in LocationType]: {
    label: string
    Component: React.ComponentType<BasicEditorProps>
    ComponentWithDrawButton: React.ComponentType<BasicEditorProps>
    shape: shapes.Shape
  }
}

type EditorPropsMap = { [editorType in LocationType]: any }

type Props = BasicEditorProps & {
  enableDrawing?: boolean
  editorProps?: EditorPropsMap
}

const componentMap: LocationTypeComponentMap = {
  line: {
    label: 'Line',
    Component: withCoordinateUnitTabs(Line),
    ComponentWithDrawButton: withDrawButton(
      withCoordinateUnitTabs(Line),
      shapes.LINE
    ),
    shape: shapes.LINE,
  },
  polygon: {
    label: 'Polygon',
    Component: withCoordinateUnitTabs(Polygon),
    ComponentWithDrawButton: withDrawButton(
      withCoordinateUnitTabs(Polygon),
      shapes.POLYGON
    ),
    shape: shapes.POLYGON,
  },
  pointRadius: {
    label: 'Point-Radius',
    Component: withCoordinateUnitTabs(PointRadius),
    ComponentWithDrawButton: withDrawButton(
      withCoordinateUnitTabs(PointRadius),
      shapes.POINT_RADIUS
    ),
    shape: shapes.POINT_RADIUS,
  },
  bbox: {
    label: 'Bounding Box',
    Component: withCoordinateUnitTabs(BBox),
    ComponentWithDrawButton: withDrawButton(
      withCoordinateUnitTabs(BBox),
      shapes.BBOX
    ),
    shape: shapes.BOUNDING_BOX,
  },
  keyword: {
    label: 'Keyword',
    Component: Keyword,
    ComponentWithDrawButton: Keyword,
    shape: shapes.POLYGON,
  },
}

type ShapeToLocationTypeMap = { [key: string]: LocationType }

const shapeToLocationTypeMap: ShapeToLocationTypeMap = {
  [shapes.LINE]: 'line',
  [shapes.POLYGON]: 'polygon',
  [shapes.POINT_RADIUS]: 'pointRadius',
  [shapes.POINT]: 'pointRadius',
  [shapes.BOUNDING_BOX]: 'bbox',
}

const shapeDetector = new shapes.ShapeDetector()

const locationTypeFromGeo = (geo: geometry.GeometryJSON): LocationType => {
  if (typeof geo.properties.keyword === 'string') {
    return 'keyword'
  } else {
    const shape = geo.properties.shape || shapeDetector.shapeFromGeoJSON(geo)
    return shapeToLocationTypeMap[shape]
  }
}

const Location: React.SFC<Props> = ({
  value,
  onChange,
  enableDrawing = true,
  editorProps = {} as EditorPropsMap,
}) => {
  const locationType = locationTypeFromGeo(value)
  const Component = enableDrawing
    ? componentMap[locationType].ComponentWithDrawButton
    : componentMap[locationType].Component
  const extendedComponentProps = editorProps.hasOwnProperty(locationType)
    ? editorProps[locationType]
    : {}
  const onSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // the geo must match the location type
    const updatedType = e.target.value as LocationType
    const shape = componentMap[updatedType].shape
    const { id, keyword = '', keywordId = '', ...rest } = value.properties
    const properties =
      updatedType === 'keyword'
        ? {
            ...rest,
            keyword,
            keywordId,
          }
        : rest
    const geo = geometry.makeEmptyGeometry(id, shape, properties)
    onChange(geo)
  }
  return (
    <FormControl fullWidth>
      <InputLabel>Location</InputLabel>
      <Select value={locationType} onChange={onSelection}>
        {Object.keys(componentMap).map((key: LocationType) => (
          <MenuItem key={key} value={key}>
            {componentMap[key].label}
          </MenuItem>
        ))}
      </Select>
      <Component
        value={value}
        onChange={onChange}
        {...extendedComponentProps}
      />
    </FormControl>
  )
}

export default Location
