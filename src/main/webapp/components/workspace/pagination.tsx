import React from 'react'
import { useUserPrefs } from '../../react-hooks'
import { get } from 'immutable'
import Pagination from '@material-ui/lab/Pagination'

type PaginationProps = {
  resultCount: number
  page: number
  onSelect: (options: any) => void
}
export default (props: PaginationProps) => {
  const { resultCount, onSelect, page } = props

  const [userPrefs] = useUserPrefs()
  const pageSize = get(userPrefs, 'resultCount', 0)

  const onChange = (_: object, page: number) => {
    const startIndex = (page - 1) * pageSize + 1
    onSelect({ startIndex, pageSize, page })
  }

  return (
    <Pagination
      page={page}
      count={Math.floor(resultCount / pageSize)}
      onChange={onChange}
    />
  )
}
