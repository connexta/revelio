export type MetacardType =
  | 'STRING'
  | 'XML'
  | 'DATE'
  | 'LOCATION'
  | 'BOOLEAN'
  | 'INTEGER'
  | 'SHORT'
  | 'LONG'
  | 'FLOAT'
  | 'DOUBLE'

export const metacardDefinitions: Map<string, MetacardType> = new Map([
  ['anyText', 'STRING'],
  ['date-created', 'DATE'],
  ['anyGeo', 'LOCATION'],
  ['enterprise', 'BOOLEAN'],
  ['an integer', 'INTEGER'],
  ['a float', 'FLOAT'],
])

