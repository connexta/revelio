import React from 'react'
import Box from '@material-ui/core/Box'
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

const setupState = items => {
  return Object.keys(items)
    .map(permission => {
      if (Array.isArray(items[permission])) {
        return items[permission].map(label => {
          return {
            label,
            permission,
          }
        })
      }
    })
    .flat()
    .filter(item => item !== undefined)
}

const convertState = (userState, groupState, metacardType) => {
  const attributes = {
    security_access_individuals_read: userState
      .filter(user => user.permission === 'security_access_individuals_read')
      .map(user => user.label),
    security_access_individuals: userState
      .filter(user => user.permission === 'security_access_individuals')
      .map(user => user.label),
    security_access_administrators: userState
      .filter(user => user.permission === 'security_access_administrators')
      .map(user => user.label),
    security_access_groups_read: groupState
      .filter(group => group.permission === 'security_access_groups_read')
      .map(group => group.label),
    security_access_groups: groupState
      .filter(group => group.permission === 'security_access_groups')
      .map(group => group.label),
    metacard_type: metacardType,
  }
  return attributes
}

export default props => {
  const { individuals, groups, userRoles, save, id, metacardType } = props
  const [tabValue, setTabValue] = React.useState(0)
  const [userState, setUserState] = React.useState(setupState(individuals))
  const [groupState, setGroupState] = React.useState(setupState(groups))

  const handleChange = (event, index, type, userOrGroup) => {
    if (userOrGroup === 'user') {
      const updatedUsers = [...userState]
      updatedUsers[index][type] = event.target.value
      setUserState(updatedUsers)
    } else {
      const updatedGroups = [...groupState]
      updatedGroups[index][type] = event.target.value
      setGroupState(updatedGroups)
    }
  }

  const removeItem = (index, userOrGroup) => {
    if (userOrGroup === 'user') {
      const updatedUsers = [...userState]
      updatedUsers.splice(index, 1)
      setUserState(updatedUsers)
    } else {
      const updatedGroups = [...groupState]
      updatedGroups.splice(index, 1)
      setGroupState(updatedGroups)
    }
  }

  const addItem = userOrGroup => {
    userOrGroup === 'user'
      ? setUserState([
          ...userState,
          { label: '', permission: 'security_access_individuals_read' },
        ])
      : setGroupState([
          ...groupState,
          { label: '', permission: 'security_access_groups_read' },
        ])
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
        style={{ marginTop: '.625em' }}
      >
        <Box>
          <UserSharePanel
            individuals={individuals}
            state={userState}
            addUser={addItem}
            removeUser={removeItem}
            handleChange={handleChange}
          />
        </Box>
      </Typography>
      <Typography
        component="div"
        role="tabpanel"
        hidden={1 !== tabValue}
        style={{ marginTop: '.625em' }}
      >
        <Box>
          <GroupSharePanel
            groups={groups}
            userRoles={userRoles}
            state={groupState}
            addGroup={addItem}
            removeGroup={removeItem}
            handleChange={handleChange}
          />
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
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => {
              const attrs = convertState(userState, groupState, metacardType)
              save({ variables: { id, attrs } })
              props.handleClose(true)
            }}
          >
            Save All (Users & Groups)
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
