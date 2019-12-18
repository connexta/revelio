import { Style, Fill, Circle, Stroke, Icon, Text } from 'ol/style'
import { transparentize } from 'polished'
import MultiPoint from 'ol/geom/MultiPoint'
import { geometry } from 'geospatialdraw'
const { BUFFER_CLASSNAME, HIDDEN_CLASSNAME, POINT_RADIUS, POLYGON } = geometry
import { getIconText } from '../icons/map-pin'

const LINE_WIDTH = 1.8
const POINT_SIZE = 4
const SCALE_FACTOR = 1.5
const MIN_OPACITY = 0.15
const DRAW_COLOR = 'rgba(200, 150, 0, 1)'
const HOVER_COLOR = DRAW_COLOR
const SELECTED_COLOR = 'rgba(0, 0, 255, 1)'
const ICON_COLOR = 'rgba(0, 125, 0, 1)'

const featureHasClass = (feature, className) =>
  (feature.get('class') || []).includes(className)

const featureColor = (feature, opacity = 1, defaultColor = DRAW_COLOR) => {
  if (featureHasClass(feature, HIDDEN_CLASSNAME)) {
    return 'rgba(0, 0, 0, 0)'
  } else if (feature.get('hover')) {
    return transparentize(1 - opacity, HOVER_COLOR)
  } else if (feature.get('selected')) {
    return transparentize(1 - opacity, SELECTED_COLOR)
  } else {
    return transparentize(1 - opacity, feature.get('color') || defaultColor)
  }
}

const textStyleCache = {}

const textStyle = feature => {
  const count = feature.get('features') ? feature.get('features').length : 0
  const text = count > 1 ? count.toString() : ''
  const fillColor = featureColor(feature, 1, ICON_COLOR)
  const colorMap = textStyleCache[text] || {}
  const style =
    colorMap[fillColor] ||
    new Text({
      text,
      font: 'bold 16px/1 verdana',
      offsetY: -18,
      placement: 'point',
      textBaseline: 'middle',
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 1)',
        width: LINE_WIDTH * SCALE_FACTOR,
      }),
      fill: new Fill({
        color: fillColor,
      }),
    })
  colorMap[fillColor] = style
  textStyleCache[text] = colorMap
  return style
}

const iconStyleCache = {}

const iconStyle = feature => {
  const color = featureColor(feature)
  const iconColor = featureColor(feature, 1, ICON_COLOR)
  const iconColorMap = iconStyleCache[color] || {}
  const style =
    iconColorMap[iconColor] ||
    new Icon({
      fill: new Fill({
        color,
      }),
      stroke: new Stroke({
        color,
      }),
      anchor: [0.5, 1],
      opacity: 1,
      src:
        'data:image/svg+xml,' +
        escape(
          getIconText({
            color: iconColor,
          })
        ),
      scale: 2,
    })
  iconColorMap[iconColor] = style
  iconStyleCache[color] = iconColorMap
  return style
}

const RENDERER_STYLE = feature =>
  feature.getGeometry() && feature.getGeometry().getType() === 'Point'
    ? new Style({
        stroke: new Stroke({
          color: featureColor(feature),
          width: LINE_WIDTH,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0)',
        }),
        text: textStyle(feature),
        image: iconStyle(feature),
      })
    : new Style({
        stroke: new Stroke({
          color: featureColor(feature),
          width: LINE_WIDTH,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0)',
        }),
        ...(featureHasClass(feature, BUFFER_CLASSNAME) &&
        feature.get('shape') === POINT_RADIUS
          ? {}
          : {
              image: new Circle({
                radius: POINT_SIZE,
                fill: new Fill({
                  color: featureColor(feature),
                }),
              }),
            }),
      })

const CIRCLE_DRAWING_STYLE = feature =>
  new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0)',
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0)',
    }),
    image: new Circle({
      radius: POINT_SIZE,
      fill: new Fill({
        color: featureColor(feature),
      }),
    }),
  })

const CIRCLE_BUFFER_PROPERTY_VALUE_DRAWING_STYLE = feature =>
  new Style({
    stroke: new Stroke({
      color: featureColor(feature),
      width: LINE_WIDTH * SCALE_FACTOR,
    }),
    fill: new Fill({
      color: featureColor(feature, MIN_OPACITY),
    }),
  })

const GENERIC_DRAWING_STYLE = feature => [
  new Style({
    stroke: new Stroke({
      color: featureColor(feature),
      width: LINE_WIDTH * SCALE_FACTOR,
    }),
    fill: new Fill({
      color: featureColor(feature, MIN_OPACITY),
    }),
    ...(feature.getGeometry() &&
    feature.getGeometry().getType() === 'Point' &&
    feature.get('buffer') &&
    feature.get('buffer').width > 0
      ? {}
      : {
          image: new Circle({
            radius: POINT_SIZE * SCALE_FACTOR,
            fill: new Fill({
              color: featureColor(feature),
            }),
          }),
        }),
  }),
  new Style({
    image: new Circle({
      radius: POINT_SIZE,
      fill: new Fill({
        color: featureColor(feature),
      }),
    }),
    geometry: feature => {
      const geometry = feature.getGeometry()
      let coordinates = []
      if (geometry) {
        if (geometry.getType() === 'Polygon') {
          coordinates = geometry.getCoordinates()[0]
        } else if (geometry.getType() === 'LineString') {
          coordinates = geometry.getCoordinates()
        }
      }
      return new MultiPoint(coordinates)
    },
  }),
]

const DRAWING_STYLE = feature => {
  if (feature.getGeometry().getType() === 'Circle') {
    return CIRCLE_DRAWING_STYLE(feature)
  } else if (featureHasClass(feature, BUFFER_CLASSNAME)) {
    return feature.get('shape') === POLYGON
      ? RENDERER_STYLE(feature)
      : CIRCLE_BUFFER_PROPERTY_VALUE_DRAWING_STYLE(feature)
  } else {
    return GENERIC_DRAWING_STYLE(feature)
  }
}

export { DRAWING_STYLE, RENDERER_STYLE }
