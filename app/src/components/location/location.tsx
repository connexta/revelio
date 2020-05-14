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
import { makeEmptyGeometry } from 'geospatialdraw/bin/geometry/utilities'
import {
  LINE,
  POLYGON,
  POINT_RADIUS,
  BBOX,
  POINT,
  Shape,
} from 'geospatialdraw/bin/shapes/shape'
import ShapeDetector from 'geospatialdraw/bin/shapes/shape-detector'
import { GeometryJSON } from 'geospatialdraw/bin/geometry/geometry'

type LocationType = 'line' | 'polygon' | 'pointRadius' | 'bbox' | 'keyword'

type LocationTypeComponentMap = {
  [type in LocationType]: {
    label: string
    Component: React.ComponentType<BasicEditorProps>
    ComponentWithDrawButton: React.ComponentType<BasicEditorProps>
    shape: Shape
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
    ComponentWithDrawButton: withDrawButton(withCoordinateUnitTabs(Line), LINE),
    shape: LINE,
  },
  polygon: {
    label: 'Polygon',
    Component: withCoordinateUnitTabs(Polygon),
    ComponentWithDrawButton: withDrawButton(
      withCoordinateUnitTabs(Polygon),
      POLYGON
    ),
    shape: POLYGON,
  },
  pointRadius: {
    label: 'Point-Radius',
    Component: withCoordinateUnitTabs(PointRadius),
    ComponentWithDrawButton: withDrawButton(
      withCoordinateUnitTabs(PointRadius),
      POINT_RADIUS
    ),
    shape: POINT_RADIUS,
  },
  bbox: {
    label: 'Bounding Box',
    Component: withCoordinateUnitTabs(BBox),
    ComponentWithDrawButton: withDrawButton(withCoordinateUnitTabs(BBox), BBOX),
    shape: BBOX,
  },
  keyword: {
    label: 'Keyword',
    Component: Keyword,
    ComponentWithDrawButton: Keyword,
    shape: POLYGON,
  },
}

type ShapeToLocationTypeMap = { [key: string]: LocationType }

const shapeToLocationTypeMap: ShapeToLocationTypeMap = {
  [LINE]: 'line',
  [POLYGON]: 'polygon',
  [POINT_RADIUS]: 'pointRadius',
  [POINT]: 'pointRadius',
  [BBOX]: 'bbox',
}

const shapeDetector = new ShapeDetector()

const locationTypeFromGeo = (geo: GeometryJSON): LocationType => {
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
  const locationTypeDescription = componentMap[locationType]
  const Component = enableDrawing
    ? locationTypeDescription.ComponentWithDrawButton
    : locationTypeDescription.Component
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
    const geo = makeEmptyGeometry(id, shape, properties)
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
