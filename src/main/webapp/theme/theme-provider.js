import React from 'react'

import { dark, light } from './theme'
import { MuiThemeProvider } from '@material-ui/core/styles'

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
  const { loading, error, data } = useQuery(query)

  if (loading || error) {
    return light
  }

  if (data.user.preferences.theme.theme === 'dark') {
    return dark
  }

  return light
}

export default ({ children }) => {
  const theme = useTheme()

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}
