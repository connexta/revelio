import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const permissionLevels = [
  {
    value: 'READ',
    label: 'Can read',
  },
  {
    value: 'WRITE',
    label: 'Can write',
  },
  {
    value: 'ADMIN',
    label: 'Owner',
  },
]

export const UserAddRow = props => {
  const { value = '' } = props
  const [permission, setPermissions] = React.useState('READ')
  return (
    <Grid
      spacing={1}
      style={{ marginBottom: '.625rem', width: '100%' }}
      justify="flex-start"
      container
    >
      <Grid item xs={7}>
        <TextField
          label="Enter a user"
          variant="outlined"
          style={{ width: '100%' }}
          value={value}
        />
      </Grid>
      <Grid item>
        <Button
          color="primary"
          variant="contained"
          style={{ position: 'relative', height: '100%', width: '100%' }}
        >
          Share
        </Button>
      </Grid>
      <Grid item xs={3}>
        <TextField
          select
          label="Permission"
          value={permission}
          onChange={e => {
            setPermissions(e.target.value)
          }}
          style={{ height: '100%', width: '100%' }}
        >
          {permissionLevels.map(perm => (
            <MenuItem key={perm.value} value={perm.value}>
              {perm.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  )
}

export default UserAddRow
