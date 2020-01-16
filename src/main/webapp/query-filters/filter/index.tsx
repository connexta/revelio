import * as React from 'react'
import IndividualFilter, {
  QueryFilter,
  QueryFilterProps,
} from './individual-filter'
import FilterGroup, { FilterGroupType, FilterGroupProps } from './filter-group'
export { makeDefaultSearchGeo, makeSearchGeoId } from './search-geo-factory'

export const isFilterGroup = (
  object: QueryFilter | FilterGroupType
): object is FilterGroupType =>
  (object as FilterGroupType).filters !== undefined

type FilterProps = FilterGroupProps | QueryFilterProps

const Filter = (props: FilterProps) => {
  const Component = isFilterGroup(props.filter) ? FilterGroup : IndividualFilter
  return <Component {...props} />
}

export default Filter
