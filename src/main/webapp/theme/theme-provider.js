import React from 'react'

import { dark, light } from './theme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { getIn } from 'immutable'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const query = gql`
  query Theme {
    user {
      preferences {
        theme {
          theme
        }
      }
    }
  }
`

const useTheme = () => {
  const { data } = useQuery(query)

  const theme = getIn(data, ['user', 'preferences', 'theme', 'theme'], 'light')

  return theme === 'dark' ? dark : light
}

export default ({ children }) => {
  const theme = useTheme()

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}
