import React from 'react'

import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

const path = ['theme', 'theme']

export default props => {
  const { value, onChange } = props
  const darkMode = value.getIn(path) === 'dark'

  const setTheme = theme => {
    onChange(value.setIn(path, theme))
  }

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            color="primary"
            checked={darkMode}
            onChange={(_, checked) => {
              setTheme(checked ? 'dark' : 'sea')
            }}
          />
        }
        label="Dark Mode"
      />
    </FormGroup>
  )
}
