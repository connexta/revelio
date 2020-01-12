export type AttributeDefinition = {
  id: string
  enums: string[]
  type:
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
}

export const sampleAttributeDefinitions = [
  {
    type: 'XML',
    enums: [],
    id: 'metadata',
  },
  {
    type: 'BINARY',
    enums: [],
    id: 'thumbnail',
  },
  {
    type: 'BOOLEAN',
    enums: [],
    id: 'phonetics',
  },
  {
    type: 'DATE',
    enums: [],
    id: 'created',
  },
  {
    type: 'DOUBLE',
    enums: [],
    id: 'media.bit.rate',
  },
  {
    type: 'INTEGER',
    enums: [],
    id: 'media.width-pixels',
  },
  {
    type: 'LONG',
    enums: [],
    id: 'ext.population',
  },
  {
    type: 'GEOMETRY',
    enums: [],
    id: 'anyGeo',
  },
  {
    type: 'GEOMETRY',
    enums: [],
    id: 'location',
  },
  {
    type: 'STRING',
    enums: ['cat', 'dog', 'catdog'],
    id: 'topic.vocabulary',
  },
]
