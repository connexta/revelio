import * as React from 'react'
import { useContext } from 'react'
import { sampleMetacardTypes } from './filter/dummyDefinitions'

const FilterContext = React.createContext({
  metacardTypes: sampleMetacardTypes,
})
const useFilterContext = () => {
  const context = useContext(FilterContext)
  return context
}

export { FilterContext, useFilterContext }
