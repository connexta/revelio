import React, { useState, useEffect, memo } from 'react'
import * as turf from '@turf/turf'
import WorldMap from './world-map'

import Vector from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Cluster from 'ol/source/Cluster'
import GeoJSON from 'ol/format/GeoJSON'
import { POINT } from 'geospatialdraw/bin/shapes/shape'
import { makeBufferedGeo } from 'geospatialdraw/bin/geometry/utilities'

const ClusterMap = ({
  distance,
  style,
  geos = [],
  selectGeos,
  onMapLoaded = () => {},
  ...rest
}) => {
  const [map, setMap] = useState(null)
  const [sourceVector, setSourceVector] = useState(null)
  const geoFormat = new GeoJSON()
  const nonPointGeos = geos.filter(g => g.properties.shape !== POINT)
  useEffect(() => {
    if (map && !sourceVector) {
      const source = new VectorSource({
        features: [],
      })
      const clusterSource = new Cluster({
        distance,
        source,
      })
      const vectorLayer = new Vector({
        source: clusterSource,
        zIndex: 1,
        style,
      })
      const featureHover = e => {
        clusterSource.forEachFeature(f => {
          f.set('hover', false)
        })
        map.getFeaturesAtPixel(e.pixel).forEach(f => {
          f.set('hover', true)
        })
      }
      const featureClick = e => {
        const selectedGeoList = map
          .getFeaturesAtPixel(e.pixel)
          .reduce((ids, f) => {
            const featuresList = f.get('features') || []
            featuresList.forEach(f => {
              ids.push(f.getId())
            })
            return ids
          }, [])
        selectGeos(selectedGeoList)
      }
      map.addLayer(vectorLayer)
      map.on('pointermove', featureHover)
      map.on('click', featureClick)
      clusterSource.on('addfeature', e => {
        const clusterFeature = e.feature
        const featureList = clusterFeature.get('features') || []
        featureList.forEach(f => {
          const props = {
            ...f.getProperties(),
            geometry: clusterFeature.get('geometry'),
            selected: false,
            hover: false,
          }
          clusterFeature.setProperties(props)
        })
        clusterFeature.set(
          'selected',
          featureList.every(f => f.get('selected'))
        )
      })
      setSourceVector(source)
      onMapLoaded(map)
    }
  }, [map, sourceVector, style, distance, onMapLoaded, selectGeos])
  useEffect(() => {
    if (sourceVector) {
      sourceVector.clear()
      geos.forEach(json => {
        const buffered = makeBufferedGeo(json)
        const point = turf.center(buffered)
        const feature = geoFormat.readFeature(point)
        const props = {
          ...json.properties,
          geometry: feature.get('geometry'),
        }
        feature.setProperties(props)
        feature.setId(json.properties.id)
        sourceVector.addFeature(feature)
      })
    }
  }, [sourceVector, geos, geoFormat])
  return (
    <WorldMap
      geos={nonPointGeos}
      style={style}
      onMapLoaded={setMap}
      {...rest}
    />
  )
}

export default memo(ClusterMap)
