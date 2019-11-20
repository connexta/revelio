import { MetacardType } from './dummyDefinitions'

/*
 * Defines transformations for when the user changes comparators so part
 * of the previous value is preserved
 */

const toNearValue = (value: string) => ({ value, distance: 2 })

const fromNearValue = (value: any) => value.value

const toBetweenValue = (value: string) => ({ lower: value, upper: value })

const fromBetweenValue = (value: any) => value.lower

const toDuringValue = (value: any) => {
  if (value == null) return ''
  const date = new Date(value)
  if (!isNaN(date.valueOf())) {
    return `${date.toISOString()}/${date.toISOString()}`
  }
  return ''
}

const fromDuringValue = (value: string) => {
  const dates = value.split('/')
  const from = new Date(dates[0])
  if (!isNaN(from.valueOf())) {
    return from.toISOString()
  }

  return ''
}

const default_relative_value = 'RELATIVE(PT1M)'

const fromRelativeValue = () => ''

const toRelativeValue = () => default_relative_value

type ValueTransformationInput = {
  propertyType: MetacardType
  currentValue: any
  oldOperator: string
  newOperator: string
}

export const transformValue = ({
  propertyType,
  currentValue,
  oldOperator,
  newOperator,
}: ValueTransformationInput) => {
  if (oldOperator === newOperator) return currentValue
  let value = currentValue
  switch (oldOperator) {
    case 'NEAR':
      value = fromNearValue(value)
      break
    case 'BETWEEN':
      value = fromBetweenValue(value)
      break
    case 'DURING':
      value = fromDuringValue(value)
      break
    case '=':
      if (propertyType === 'DATE') value = fromRelativeValue()
      break
    case 'IS NULL':
      value = propertyType === 'BOOLEAN' ? false : ''
      break
  }

  switch (newOperator) {
    case 'NEAR':
      value = toNearValue(value)
      break
    case 'BETWEEN':
      value = toBetweenValue(value)
      break
    case 'DURING':
      value = toDuringValue(value)
      break
    case '=':
      if (propertyType === 'DATE') value = toRelativeValue()
      break
  }
  return value
}
