import * as React from 'react'

import { dark, light } from '../theme/theme'
import { MuiThemeProvider } from '@material-ui/core/styles'

import { boolean } from '@storybook/addon-knobs'

const withTheme = Story => {
  const darkMode = boolean('Dark Mode', false)
  const theme = darkMode ? dark : light
  const background = theme.palette.background.default

  return (
    <MuiThemeProvider theme={theme}>
      <style>{`body {margin: 0; background: ${background};}`}</style>
      <Story />
    </MuiThemeProvider>
  )
}

export default withTheme
