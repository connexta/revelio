import * as ol from 'openlayers'
import { geometry } from 'geospatialdraw'

const featureColor = (feature, alpha = 1) =>
  feature.get('hidden') ? 'rgba(0, 0, 0, 0)' : `rgba(200, 150, 0, ${alpha})`

const {
  CIRCLE_BUFFER_PROPERTY_VALUE,
  POLYGON_LINE_BUFFER_PROPERTY_VALUE,
  BUFFER_SHAPE_PROPERTY,
} = geometry

const LINE_WIDTH = 1.8
const POINT_SIZE = 4
const SCALE_FACTOR = 1.5

const RENDERER_STYLE = feature =>
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: featureColor(feature),
      width: LINE_WIDTH,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0)',
    }),
    ...(feature.get(BUFFER_SHAPE_PROPERTY) === CIRCLE_BUFFER_PROPERTY_VALUE
      ? {}
      : {
          image: new ol.style.Circle({
            radius: POINT_SIZE,
            fill: new ol.style.Fill({
              color: featureColor(feature),
            }),
          }),
        }),
  })

const CIRCLE_DRAWING_STYLE = feature =>
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0)',
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0)',
    }),
    image: new ol.style.Circle({
      radius: POINT_SIZE,
      fill: new ol.style.Fill({
        color: featureColor(feature),
      }),
    }),
  })

const CIRCLE_BUFFER_PROPERTY_VALUE_DRAWING_STYLE = feature =>
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: featureColor(feature),
      width: LINE_WIDTH * SCALE_FACTOR,
    }),
    fill: new ol.style.Fill({
      color: featureColor(feature, 0.05),
    }),
  })

const GENERIC_DRAWING_STYLE = feature => [
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: featureColor(feature),
      width: LINE_WIDTH * SCALE_FACTOR,
    }),
    fill: new ol.style.Fill({
      color: featureColor(feature, 0.05),
    }),
    ...(feature.getGeometry().getType() === 'Point' && feature.get('buffer') > 0
      ? {}
      : {
          image: new ol.style.Circle({
            radius: POINT_SIZE * SCALE_FACTOR,
            fill: new ol.style.Fill({
              color: featureColor(feature),
            }),
          }),
        }),
  }),
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: POINT_SIZE,
      fill: new ol.style.Fill({
        color: featureColor(feature),
      }),
    }),
    geometry: feature => {
      const geometry = feature.getGeometry()
      let coordinates = []
      if (geometry.getType() === 'Polygon') {
        coordinates = geometry.getCoordinates()[0]
      } else if (geometry.getType() === 'LineString') {
        coordinates = geometry.getCoordinates()
      }
      return new ol.geom.MultiPoint(coordinates)
    },
  }),
]

const DRAWING_STYLE = feature => {
  if (feature.getGeometry().getType() === 'Circle') {
    return CIRCLE_DRAWING_STYLE(feature)
  } else {
    const bufferShape = feature.get(BUFFER_SHAPE_PROPERTY)
    switch (bufferShape) {
      case POLYGON_LINE_BUFFER_PROPERTY_VALUE:
        return RENDERER_STYLE(feature)
      case CIRCLE_BUFFER_PROPERTY_VALUE:
        return CIRCLE_BUFFER_PROPERTY_VALUE_DRAWING_STYLE(feature)
      default:
        return GENERIC_DRAWING_STYLE(feature)
    }
  }
}

export { DRAWING_STYLE, RENDERER_STYLE }
