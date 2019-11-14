import * as React from 'react'
import { useContext } from 'react'
import { metacardDefinitions } from './filter/dummyDefinitions'

const FilterContext = React.createContext({
  includedAttributes: Array.from(metacardDefinitions.keys()),
  editing: true,
})
const useFilterContext = () => {
  const context = useContext(FilterContext)
  return context
}

export { FilterContext, useFilterContext }
