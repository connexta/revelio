import React from 'react'
import { LinearProgress } from '@material-ui/core'
import { Divider } from '@material-ui/core'
import { Tab } from '@material-ui/core'
import { Tabs } from '@material-ui/core'
import { Person } from '@material-ui/icons'
import { Group } from '@material-ui/icons'
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

export const Sharing = props => {
  const [tabValue, setTabValue] = React.useState(0)
  const [permission, setPermissions] = React.useState('READ')
  const { loading, error, individuals, groups } = props
  if (loading) {
    return <LinearProgress />
  }
  if (error) {
    return <div>Error</div>
  }

  return (
    <React.Fragment>
      <Tabs
        value={tabValue}
        onChange={(_e, v) => setTabValue(v)}
        variant="fullWidth"
        scrollButtons="on"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Users" icon={<Person />} />
        <Tab label="Groups" icon={<Group />} />
      </Tabs>
      <Divider />
      <FormControl>
        <Grid
          spacing={3}
          alignItems="center"
          style={{ margineBottom: '10px' }}
          justify="flex-start"
          container
        >
          <Grid item style={{ width: '400px' }}>
            <TextField label="Enter a user" variant="outlined" />
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              style={{ position: 'relative' }}
            >
              Share
            </Button>
          </Grid>
          <Grid item>
            <TextField
              select
              style={{ position: 'relative' }}
              label="Permission"
              value={permission}
              onChange={e => {
                setPermissions(e.target.value)
              }}
            >
              {permissionLevels.map(perm => (
                <MenuItem key={perm.value} value={perm.value}>
                  {perm.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </FormControl>
    </React.Fragment>
  )
}

export default Sharing
