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

const groups = [
  {
    value: 'ADMIN',
    label: 'admin',
  },
  {
    value: 'DATAMANAGER',
    label: 'data-manager',
  },
  {
    value: 'GUEST',
    label: 'guest',
  },
  {
    value: 'LOCALHOSTDATA',
    label: 'localhost-data-manager',
  },
  {
    value: 'MANAGER',
    label: 'manager',
  },
  {
    value: 'SYSADMIN',
    label: 'system-admin',
  },
]

export const UserAddRow = props => {
  const [permission, setPermissions] = React.useState('READ')
  const [group, setGroup] = React.useState('ADMIN')
  return (
    <Grid
      spacing={1}
      style={{ marginBottom: '.625rem', width: '100%' }}
      justify="flex-start"
      container
    >
      <Grid item xs={7}>
        <TextField
          label="Group"
          select
          style={{ height: '100%', width: '100%' }}
          value={group}
          onChange={e => {
            setGroup(e.target.value)
          }}
        >
          {groups.map(group => (
            <MenuItem key={group.value} value={group.value}>
              {group.label}
            </MenuItem>
          ))}
        </TextField>
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
