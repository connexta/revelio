import { AttributeDefinition } from './dummyDefinitions'

export const defaultFilter = {
  property: 'anyText',
  type: 'ILIKE',
  value: '',
}

export const filterHeaderButtonStyle = {
  margin: 'auto',
  marginLeft: 0,
  marginRight: 10,
}

export const getDefaultValue = (
  type: AttributeDefinition['type'] | undefined
) => {
  switch (type) {
    case 'LOCATION':
      return null
    case 'DATE':
      return ''
    case 'BOOLEAN':
      return false
    case 'STRING':
      return ''
    case 'INTEGER':
    case 'SHORT':
    case 'LONG':
      return '0'
    case 'FLOAT':
    case 'DOUBLE':
      return '0.0'
    default:
      return ''
  }
}
