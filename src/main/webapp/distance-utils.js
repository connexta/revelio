/* eslint-disable no-unused-vars */
const EARTH_MEAN_RADIUS_METERS = 6371008.7714

const DEGREES_TO_RADIANS = Math.PI / 180
const RADIANS_TO_DEGREES = 1 / DEGREES_TO_RADIANS

/* 6 Digits of precision used because it gives precision up to 
0.11 meters, which was deemed precise enough for any use case 
of application */

const DECIMAL_PRECISION = 6
/* eslint-enable */

const METERS_KILOMETERS = 1000
const METERS_FEET = 0.3048
const METERS_YARDS = 0.9144
const METERS_MILES = 1609.344
const METERS_NAUTICAL_MILES = 1852

const getDistanceInMeters = ({ distance, units }) => {
  distance = distance || 0
  switch (units) {
    case 'kilometers':
      return distance * METERS_KILOMETERS
    case 'feet':
      return distance * METERS_FEET
    case 'yards':
      return distance * METERS_YARDS
    case 'miles':
      return distance * METERS_MILES
    case 'nautical miles':
      return distance * METERS_NAUTICAL_MILES
    case 'meters':
    default:
      return distance
  }
}

const getDistanceFromMeters = ({ distance, units }) => {
  distance = distance || 0
  switch (units) {
    case 'kilometers':
      return distance / METERS_KILOMETERS
    case 'feet':
      return distance / METERS_FEET
    case 'yards':
      return distance / METERS_YARDS
    case 'miles':
      return distance / METERS_MILES
    case 'nautical miles':
      return distance / METERS_NAUTICAL_MILES
    case 'meters':
    default:
      return distance
  }
}

export { getDistanceInMeters, getDistanceFromMeters }
