import * as React from 'react'
import IndividualFilter, {
  QueryFilter,
  QueryFilterProps,
} from './individual-filter'
import FilterGroup, { FilterGroupType, FilterGroupProps } from './filter-group'
import { FilterContext } from '../filter-context'
import { sampleMetacardTypes } from './dummyDefinitions'
import useMetacardTypes from '../../react-hooks/use-metacard-types'
import { Paper, LinearProgress, Typography } from '@material-ui/core'

const useApolloFallback = require('../../react-hooks/use-apollo-fallback')
  .default

export const isFilterGroup = (
  object: QueryFilter | FilterGroupType
): object is FilterGroupType =>
  (object as FilterGroupType).filters !== undefined

type FilterProps = (FilterGroupProps | QueryFilterProps) & {
  metacardTypes: any
  editing?: boolean
}

const Filter = (props: FilterProps) => {
  const { metacardTypes = sampleMetacardTypes } = props
  const Component = isFilterGroup(props) ? FilterGroup : IndividualFilter
  return (
    <FilterContext.Provider
      value={{
        metacardTypes,
        editing: props.editing !== false,
      }}
    >
      <Component {...props} />
    </FilterContext.Provider>
  )
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

const Container = (props: any) => {
  const { loading, error, metacardTypes } = useMetacardTypes()
  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} />
  }

  return <Filter {...props} metacardTypes={metacardTypes} />
}

export default (props: FilterProps) => {
  const Component = useApolloFallback(Container, Filter)
  return <Component {...props} />
}
