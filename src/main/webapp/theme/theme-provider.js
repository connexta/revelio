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

const useTheme = ({ darkTheme = dark, lightTheme = light }) => {
  const { data } = useQuery(query)

  const theme = getIn(data, ['user', 'preferences', 'theme', 'theme'], 'light')

  return theme === 'dark' ? darkTheme : lightTheme
}

export default ({ children, darkTheme, lightTheme }) => {
  const theme = useTheme({ darkTheme, lightTheme })

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}
