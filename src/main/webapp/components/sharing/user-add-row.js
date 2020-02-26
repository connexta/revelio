import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const permissionLevels = [
  {
    value: 'security_access_individuals_read',
    label: 'Can read',
  },
  {
    value: 'security_access_individuals',
    label: 'Can write',
  },
  {
    value: 'security_access_administrators',
    label: 'Owner',
  },
]

export default props => {
  const { value = '', level = '', handleChange, index, removeUser } = props
  return (
    <Grid
      spacing={2}
      style={{ marginBottom: '.625rem', width: '100%' }}
      container
    >
      <Grid item xs={6}>
        <TextField
          label="Enter a user"
          variant="outlined"
          style={{ width: '100%' }}
          value={value}
          onChange={e => {
            handleChange(e, index, 'label', 'user')
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          select
          label="Permission"
          value={level}
          onChange={e => {
            handleChange(e, index, 'permission', 'user')
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
      <Grid item xs={2}>
        <Button
          color="primary"
          variant="contained"
          style={{ position: 'relative', height: '100%', width: '100%' }}
          onClick={() => {
            removeUser(index, 'user')
          }}
        >
          Remove
        </Button>
      </Grid>
    </Grid>
  )
}
