export type MetacardType = 'STRING' | 'XML' | 'DATE' | 'LOCATION' | 'BOOLEAN'

const metacardDefinitions: Map<string, MetacardType> = new Map([
  ['anyText', 'STRING'],
  ['date-created', 'DATE'],
  ['anyGeo', 'LOCATION'],
  ['enterprise', 'BOOLEAN'],
])

export default metacardDefinitions
