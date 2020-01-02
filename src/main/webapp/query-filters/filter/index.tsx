import * as React from 'react'
import IndividualFilter, {
  QueryFilter,
  QueryFilterProps,
} from './individual-filter'
import FilterGroup, { FilterGroupType, FilterGroupProps } from './filter-group'
import { FilterContext } from '../filter-context'
import useMetacardTypes from '../../react-hooks/use-metacard-types'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
export { makeDefaultSearchGeo, makeSearchGeoId } from './search-geo-factory'

const { useApolloFallback } = require('../../react-hooks')

export const isFilterGroup = (
  object: QueryFilter | FilterGroupType
): object is FilterGroupProps =>
  (object as FilterGroupProps).filters !== undefined

type FilterProps = FilterGroupProps | QueryFilterProps

const Filter = (props: FilterProps) => {
  const Component = isFilterGroup(props) ? FilterGroup : IndividualFilter
  return <Component {...props} />
}

const Loading = () => {
  return (
    <Paper>
      <LinearProgress />
    </Paper>
  )
}
const Error = (props: any) => {
  return (
    <Paper>
      <Typography>
        {props.message ? props.message : 'Something went wrong'}
      </Typography>
    </Paper>
  )
}

const Container = (props: FilterProps) => {
  const { loading, error, metacardTypes } = useMetacardTypes()
  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} />
  }

  return (
    <FilterContext.Provider
      value={{
        metacardTypes,
      }}
    >
      <Filter {...props} />
    </FilterContext.Provider>
  )
}

export default (props: FilterProps) => {
  const Component = useApolloFallback(Container, Filter)
  return <Component {...props} />
}
