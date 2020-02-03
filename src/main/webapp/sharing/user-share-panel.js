import React from 'react'
import { FormControl } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import { Button } from '@material-ui/core'
import { Grid } from '@material-ui/core'
import { MenuItem } from '@material-ui/core'

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

export const UserSharePanel = props => {
  const [permission, setPermissions] = React.useState('READ')

  return (
    <FormControl style={{ width: '100%' }}>
      <Grid
        spacing={2}
        style={{ marginBottom: '.625rem' }}
        justify="flex-start"
        container
      >
        <Grid item>
          <TextField
            label="Enter a user"
            variant="outlined"
            fullWidth
            onClick={e => {
              e.stopPropagation()
              e.preventDefault()
            }}
            onChange={e => {
              e.stopPropagation()
              e.preventDefault()
            }}
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
        <Grid item>
          <TextField
            select
            label="Permission"
            value={permission}
            onChange={e => {
              e.stopPropagation()
              e.preventDefault()
              setPermissions(e.target.value)
            }}
            style={{ height: '100%' }}
          >
            {permissionLevels.map(perm => (
              <MenuItem key={perm.value} value={perm.value}>
                {perm.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Button
        color="primary"
        variant="contained"
        style={{ width: '100%', marginBottom: '.625rem' }}
      >
        + new user
      </Button>
      <Grid spacing={1} container style={{ marginBottom: '.625rem' }}>
        <Grid item style={{ width: '50%' }}>
          <Button color="primary" variant="outlined" fullWidth>
            Cancel
          </Button>
        </Grid>
        <Grid item style={{ width: '50%' }}>
          <Button color="primary" variant="contained" fullWidth>
            Save
          </Button>
        </Grid>
      </Grid>
    </FormControl>
  )
}

export default UserSharePanel
