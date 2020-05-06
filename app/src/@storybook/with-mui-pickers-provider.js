import * as React from 'react'

import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

const withMuiPickersProvider = Story => {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Story />
    </MuiPickersUtilsProvider>
  )
}

export default withMuiPickersProvider
