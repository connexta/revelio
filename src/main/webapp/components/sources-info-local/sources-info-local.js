import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import StorageIcon from '@material-ui/icons/Storage'
import OnlineIcon from '@material-ui/icons/CloudDoneOutlined'
import OfflineIcon from '@material-ui/icons/OfflineBoltOutlined'
import { SourcesInfo } from '../sources-info/sources-info'
import { useSourcePollInterval } from '../sources-info/poll-interval'

const sources = gql`
  query SourcesInfoLocal($attribute: String!) {
    facet(attribute: $attribute) {
      value
      count
    }
    sources {
      isAvailable
      sourceId
      local
    }
  }
`
const FACET_ATTRIBUTE = 'ext.content-store-name'

const transformProp = source => {
  source.sourceId = source.value
  delete source.value
}

export default () => {
  const pollInterval = useSourcePollInterval(60000)

  const { loading, data = {}, error, refetch } = useQuery(sources, {
    pollInterval,
    variables: { attribute: FACET_ATTRIBUTE },
  })
  let listOfSources = []
  if (!loading) {
    listOfSources = data.sources.map(source => {
      source.Icon = source.isAvailable ? OnlineIcon : OfflineIcon
      return source
    })
    const facetSources = data.facet
    listOfSources = listOfSources.concat(
      facetSources.map(facetSource => {
        facetSource.Icon = StorageIcon
        facetSource.isAvailable = true
        transformProp(source)
        return facetSource
      })
    )
  }
  return (
    <SourcesInfo
      loading={loading}
      error={error}
      refetch={refetch}
      sources={listOfSources}
    />
  )
}
