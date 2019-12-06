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
import Keyword from './keyword'
import { BasicEditorProps } from './geo-editor'
import { geometry, shapes } from 'geospatialdraw'

type LocationType = 'line' | 'polygon' | 'pointRadius' | 'bbox' | 'keyword'

type LocationTypeComponentMap = {
  [type in LocationType]: {
    label: string
    Component: React.ComponentType<BasicEditorProps>
    shape: shapes.Shape
  }
}

type EditorPropsMap = { [editorType in LocationType]: any }

type Props = BasicEditorProps & {
  editorProps?: EditorPropsMap
}

const componentMap: LocationTypeComponentMap = {
  line: {
    label: 'Line',
    Component: withCoordinateUnitTabs(Line),
    shape: shapes.LINE,
  },
  polygon: {
    label: 'Polygon',
    Component: withCoordinateUnitTabs(Polygon),
    shape: shapes.POLYGON,
  },
  pointRadius: {
    label: 'Point-Radius',
    Component: withCoordinateUnitTabs(PointRadius),
    shape: shapes.POINT_RADIUS,
  },
  bbox: {
    label: 'Bounding Box',
    Component: withCoordinateUnitTabs(BBox),
    shape: shapes.BOUNDING_BOX,
  },
  keyword: {
    label: 'Keyword',
    Component: Keyword,
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

const Location: React.SFC<Props> = ({
  value,
  onChange,
  editorProps = {} as EditorPropsMap,
}) => {
  const locationType: LocationType = componentMap.hasOwnProperty(
    value.properties.locationType
  )
    ? value.properties.locationType
    : shapeToLocationTypeMap[value.properties.shape]
  const Component = componentMap[locationType].Component
  const extendedComponentProps = editorProps.hasOwnProperty(locationType)
    ? editorProps[locationType]
    : {}
  const onSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedType = e.target.value as LocationType
    const shape = componentMap[updatedType].shape
    const geo = geometry.makeEmptyGeometry(value.properties.id, shape, {
      ...value.properties,
      locationType: updatedType,
    })
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
