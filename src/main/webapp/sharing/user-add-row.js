import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const permissionLevels = [
  {
    value: 'read',
    label: 'Can read',
  },
  {
    value: 'write',
    label: 'Can write',
  },
  {
    value: 'admin',
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
            handleChange(e, index, 'userName')
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          select
          label="Permission"
          value={level}
          onChange={e => {
            handleChange(e, index, 'permission')
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
            removeUser(index)
          }}
        >
          Remove
        </Button>
      </Grid>
    </Grid>
  )
}
