import { createMuiTheme } from '@material-ui/core/styles'

import themeDark from './theme-dark.json'
import themeLight from './theme-light.json'

const dark = createMuiTheme(themeDark)
const light = createMuiTheme(themeLight)

export { dark, light }
