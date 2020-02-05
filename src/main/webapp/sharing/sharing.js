import React from 'react'
import Box from '@material-ui/core/Box'
import LinearProgress from '@material-ui/core/LinearProgress'
import Divider from '@material-ui/core/Divider'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Person from '@material-ui/icons/Person'
import Group from '@material-ui/icons/Group'
import Typography from '@material-ui/core/Typography'
import UserSharePanel from './user-share-panel'
import GroupSharePanel from './group-share-panel'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

export const Sharing = props => {
  const [tabValue, setTabValue] = React.useState(0)
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
        onChange={(e, v) => {
          setTabValue(v)
        }}
        variant="fullWidth"
        scrollButtons="on"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Users" icon={<Person />} />
        <Tab label="Groups" icon={<Group />} />
      </Tabs>
      <Divider />
      <Typography
        component="div"
        role="tabpanel"
        hidden={0 !== tabValue}
        id={`scrollable-force-tabpanel-${tabValue}`}
        style={{ marginTop: '.625em' }}
      >
        <Box>
          <UserSharePanel individuals={individuals} />
        </Box>
      </Typography>
      <Typography
        component="div"
        role="tabpanel"
        hidden={1 !== tabValue}
        id={`scrollable-force-tabpanel-${tabValue}`}
        style={{ marginTop: '.625em' }}
      >
        <Box>
          <GroupSharePanel groups={groups} />
        </Box>
      </Typography>
      <Grid spacing={1} container style={{ marginBottom: '.625rem' }}>
        <Grid item style={{ width: '50%' }}>
          <Button
            color="primary"
            variant="outlined"
            fullWidth
            onClick={() => {
              props.handleClose(true)
            }}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item style={{ width: '50%' }}>
          <Button color="primary" variant="contained" fullWidth>
            Save All
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Sharing
