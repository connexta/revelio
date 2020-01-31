import * as React from 'react'
import IndividualFilter, { QueryFilterProps } from './individual-filter'
import FilterGroup, { FilterGroupProps } from './filter-group'
import { FilterGroupType, QueryFilter } from '../types'
export {
  makeDefaultSearchGeo,
  makeSearchGeoIdForFilter,
} from './search-geo-factory'

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
