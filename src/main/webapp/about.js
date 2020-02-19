import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { About } from 'a-test-of-revelio/components'

const query = gql`
  query AboutPage {
    systemProperties {
      product
      branding
      identifier
      version
      releaseDate
    }
  }
`

export default () => {
  const { error, data = {} } = useQuery(query)
  const attributes = data.systemProperties
  const props = { error, attributes }

  return <About {...props} />
}
