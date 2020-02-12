import { Link, useLocation, useHistory } from 'react-router-dom'
import qs from 'qs'
import React from 'react'

export const DetailsLink = props => {
  const { id, children } = props
  return (
    <Link
      to={{ pathname: `/search/results/${id}` }}
      style={{ textDecoration: 'none' }}
    >
      {children}
    </Link>
  )
}

const defaultSettings = {
  query: '',
  type: 'text',
  startIndex: 1,
  pageSize: 15,
}

const useSearchRouting = () => {
  const location = useLocation()
  const history = useHistory()
  const { search } = location
  const params = qs.parse(search.substr(1))

  const query = params['query'] || defaultSettings.query
  const type = params['type'] || defaultSettings.type
  const startIndex =
    parseInt(params['startIndex'], 10) || defaultSettings.startIndex
  const pageSize = parseInt(params['pageSize'], 10) || defaultSettings.pageSize

  const settings = { query, type, startIndex, pageSize }

  const handleRoute = props => {
    const nextState = { ...settings, ...props }

    history.push({
      pathname: '/search/results',
      search: `?${qs.stringify(nextState)}`,
    })
  }

  return {
    handleRoute,
    ...settings,
  }
}

export default useSearchRouting
