/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*jshint bitwise: false*/
const cql = require('./cql.js')
export const transformFilterToCQL = filter => {
  return sanitizeGeometryCql(
    '(' + cql.write(cql.simplify(cql.read(cql.write(filter)))) + ')'
  )
}

const sanitizeGeometryCql = cqlString => {
  //sanitize polygons
  let polygons = cqlString.match(
    /'POLYGON *\(\((-?[0-9]*.?[0-9]* -?[0-9]*.?[0-9]*,?)*\)\)'/g
  )
  if (polygons) {
    polygons.forEach(polygon => {
      cqlString = cqlString.replace(polygon, polygon.replace(/'/g, ''))
    })
  }

  //sanitize multipolygons
  let multipolygons = cqlString.match(/'MULTIPOLYGON *\(\(\(.*\)\)\)'/g)
  if (multipolygons) {
    multipolygons.forEach(multipolygon => {
      cqlString = cqlString.replace(
        multipolygon,
        multipolygon.replace(/'/g, '')
      )
    })
  }

  //sanitize points
  let points = cqlString.match(
    /'POINT *\(-?[0-9]*.?[0-9]* -?[0-9]*.?[0-9]*\)'/g
  )
  if (points) {
    points.forEach(point => {
      cqlString = cqlString.replace(point, point.replace(/'/g, ''))
    })
  }

  //sanitize linestrings
  let linestrings = cqlString.match(
    /'LINESTRING *\((-?[0-9]*.?[0-9]* -?[0-9]*.?[0-9]*.?)*\)'/g
  )
  if (linestrings) {
    linestrings.forEach(linestring => {
      cqlString = cqlString.replace(linestring, linestring.replace(/'/g, ''))
    })
  }
  return cqlString
}
