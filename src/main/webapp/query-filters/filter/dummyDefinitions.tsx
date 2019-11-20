export type MetacardType =
  | 'STRING'
  | 'XML'
  | 'DATE'
  | 'LOCATION'
  | 'GEOMETRY'
  | 'BOOLEAN'
  | 'INTEGER'
  | 'SHORT'
  | 'LONG'
  | 'FLOAT'
  | 'DOUBLE'

export const sampleMetacardTypes = {
  metadata: {
    type: 'XML',
  },
  thumbnail: {
    type: 'BINARY',
  },
  phonetics: {
    type: 'BOOLEAN',
  },
  created: {
    type: 'DATE',
  },
  'media.bit.rate': {
    type: 'DOUBLE',
  },
  'media.width-pixels': {
    type: 'INTEGER',
  },
  'ext.population': {
    type: 'LONG',
  },
  location: {
    type: 'GEOMETRY',
  },
  'topic.vocabulary': {
    type: 'STRING',
  },
}
