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
    enums: [],
  },
  thumbnail: {
    type: 'BINARY',
    enums: [],
  },
  phonetics: {
    type: 'BOOLEAN',
    enums: [],
  },
  created: {
    type: 'DATE',
    enums: [],
  },
  'media.bit.rate': {
    type: 'DOUBLE',
    enums: [],
  },
  'media.width-pixels': {
    type: 'INTEGER',
    enums: [],
  },
  'ext.population': {
    type: 'LONG',
    enums: [],
  },
  location: {
    type: 'GEOMETRY',
    enums: [],
  },
  'topic.vocabulary': {
    type: 'STRING',
    enums: ['cat', 'dog', 'catdog'],
  },
}
