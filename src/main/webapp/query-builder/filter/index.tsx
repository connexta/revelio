import * as React from 'react'
import IndividualFilter, { QueryFilterProps } from './individual-filter'
import FilterGroup, { FilterGroupProps } from './filter-group'
import { isFilterGroup } from '../types'
export {
  makeDefaultSearchGeo,
  makeSearchGeoIdForFilter,
} from './search-geo-factory'

type FilterProps = FilterGroupProps | QueryFilterProps

const isFilterGroupProps = (props: FilterProps): props is FilterGroupProps =>
  isFilterGroup(props.filter)

const Filter = (props: FilterProps) => {
  const Component = isFilterGroupProps(props) ? FilterGroup : IndividualFilter
  return <Component {...props} />
}

export default Filter
