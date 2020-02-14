import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import FormLabel from '@material-ui/core/FormLabel'
import IconButton from '@material-ui/core/IconButton'

export default props => {
  const [values, setValues] = React.useState({
    username: '',
    password: '',
    showPassword: false,
    buttonDisabled: false,
  })
  const [errors, hasErrors] = React.useState(false)
  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const changePasswordVisibility = () => {
    let flip = !values['showPassword']
    setValues({ ...values, showPassword: flip })
  }
  const checkCredentials = async () => {
    setValues({ ...values, buttonDisabled: true })
    const success = await props.login(values.username, values.password)
    if (success) {
      props.handleClose()
    } else {
      hasErrors(true)
      setValues({ ...values, buttonDisabled: false })
    }
  }

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
        onChange={handleChange('username')}
        error={errors}
        helperText={errors ? 'Invalid Credentials' : undefined}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            checkCredentials()
          }
        }}
      />
      <TextField
        required
        fullWidth
        variant="outlined"
        label="Password"
        type={values.showPassword ? 'text' : 'password'}
        style={{ marginBottom: 20 }}
        error={errors}
        helperText={errors ? 'Invalid Credentials' : undefined}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle-password-visibility"
                onClick={changePasswordVisibility}
              >
                {values.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            checkCredentials()
          }
        }}
        onChange={handleChange('password')}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={values.buttonDisabled ? true : false}
        onClick={() => {
          checkCredentials()
        }}
      >
        Log In
      </Button>
    </div>
  )
}
