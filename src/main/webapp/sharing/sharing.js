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

export default props => {
  const [tabValue, setTabValue] = React.useState(0)
  const { loading, error, individuals, groups, userRoles, save, id } = props
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
          <UserSharePanel individuals={individuals} save={save} id={id} />
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
          <GroupSharePanel groups={groups} userRoles={userRoles} save={save} />
        </Box>
      </Typography>
    </React.Fragment>
  )
}
