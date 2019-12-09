import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import FormLabel from '@material-ui/core/FormLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel'
import IconButton from '@material-ui/core/IconButton'

export const LogIn = props => {
  const [values, setValues] = React.useState({
    username: '',
    password: '',
    showPassword: false,
  })
  const handleChange = prop => event => {
    setValues({ values, [prop]: event.target.value })
  }
  const changePasswordVisibility = () => {
    let flip = !values['showPassword']
    setValues({ showPassword: flip })
  }
  const logIn = props.logIn()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        padding: 20,
        boxSizing: 'border-box',
        ...props.style,
      }}
    >
      <FormLabel style={{ padding: 10 }}>{props.label}</FormLabel>
      <TextField
        autoFocus
        required
        fullWidth
        variant="outlined"
        label="Username"
        style={{ marginBottom: 20 }}
        onBlur={handleChange('username')}
      />
      <FormControl
        fullWidth
        required
        variant="outlined"
        style={{ marginBottom: 20 }}
      >
        <InputLabel>Password</InputLabel>
        <OutlinedInput
          labelWidth={80}
          type={values.showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle-password-visibility"
                onClick={changePasswordVisibility}
              >
                {values.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          onBlur={handleChange('password')}
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          //TO:DO parse cookie from gql query and set it
        }}
      >
        Log In
      </Button>
    </div>
  )
}

export default LogIn
