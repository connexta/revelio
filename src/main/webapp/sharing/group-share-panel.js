import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import GroupAddRow from './group-add-row'
import Grid from '@material-ui/core/Grid'

const setupState = groups => {
  return Object.keys(groups)
    .map(permission => {
      if (Array.isArray(groups[permission])) {
        return groups[permission].map(groupName => {
          return {
            groupName,
            permission,
          }
        })
      }
    })
    .flat()
    .filter(item => item !== undefined)
}

export const GroupSharePanel = props => {
  const { groups = {}, userRoles = [] } = props
  const [groupState, setGroupState] = React.useState(setupState(groups))

  const handleChange = (event, index, type) => {
    const updatedGroups = [...groupState]
    updatedGroups[index][type] = event.target.value
    setGroupState(updatedGroups)
  }
  const removeGroup = index => {
    const updatedGroups = [...groupState]
    updatedGroups.splice(index, 1)
    setGroupState(updatedGroups)
  }
  return (
    <FormControl style={{ width: '100%' }}>
      <div style={{ maxHeight: '400px', overflow: 'auto', paddingTop: '.5em' }}>
        {groupState.map((group, index) => {
          return (
            <GroupAddRow
              key={index}
              index={index}
              value={group.groupName}
              level={group.permission}
              userRoles={userRoles}
              handleChange={handleChange}
              removeGroup={removeGroup}
            />
          )
        })}
      </div>
      <Button
        color="primary"
        variant="contained"
        style={{ width: '100%', marginBottom: '.625rem' }}
        onClick={() => {
          setGroupState([...groupState, { group: '', permission: 'read' }])
        }}
      >
        + new group
      </Button>
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
            Save Groups
          </Button>
        </Grid>
      </Grid>
    </FormControl>
  )
}

export default GroupSharePanel
