import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const permissionLevels = [
  {
    value: 'security_access_groups_read',
    label: 'Can read',
  },
  {
    value: 'security_access_groups',
    label: 'Can write',
  },
]

export default props => {
  const {
    value = '',
    level = '',
    userRoles = [],
    index,
    handleChange,
    removeGroup,
  } = props
  return (
    <Grid
      spacing={2}
      style={{ marginBottom: '.625rem', width: '100%' }}
      justify="flex-start"
      container
    >
      <Grid item xs={6}>
        <TextField
          select
          label="Group"
          value={value}
          onChange={e => {
            handleChange(e, index, 'label', 'group')
          }}
          style={{ height: '100%', width: '100%' }}
        >
          {userRoles.map(role => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={4}>
        <TextField
          select
          label="Permission"
          value={level}
          onChange={e => {
            handleChange(e, index, 'permission', 'group')
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
            removeGroup(index)
          }}
        >
          Remove
        </Button>
      </Grid>
    </Grid>
  )
}
