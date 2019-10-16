export type MetacardType = 'STRING' | 'XML' | 'DATE' | 'LOCATION' | 'BOOLEAN'

export const metacardDefinitions: Map<string, MetacardType> = new Map([
  ['anyText', 'STRING'],
  ['date-created', 'DATE'],
  ['anyGeo', 'LOCATION'],
  ['enterprise', 'BOOLEAN'],
])
