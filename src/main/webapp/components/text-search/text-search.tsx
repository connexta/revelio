import * as React from 'react'
import { BasicSearchQueryBuilder } from '../basic-search'
import { QueryBuilderProps } from '../query-builder/query-builder'

export default (props: QueryBuilderProps) => {
  return <BasicSearchQueryBuilder {...props} addOptionsRef={null} />
}
