import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import UserAddRow from './user-add-row'
import Grid from '@material-ui/core/Grid'

const setupState = individuals => {
  return Object.keys(individuals)
    .map(permission => {
      if (Array.isArray(individuals[permission])) {
        return individuals[permission].map(userName => {
          return {
            userName,
            permission,
          }
        })
      }
    })
    .flat()
    .filter(item => item !== undefined)
}

export default props => {
  const { individuals = {}, save, id } = props
  const [userState, setUserState] = React.useState(setupState(individuals))
  const handleChange = (event, index, type) => {
    const updatedUsers = [...userState]
    updatedUsers[index][type] = event.target.value
    setUserState(updatedUsers)
  }
  const [useSave] = save()
  const removeUser = index => {
    const updatedUsers = [...userState]
    updatedUsers.splice(index, 1)
    setUserState(updatedUsers)
  }
  const convertState = () => {
    let attributes = {}
    attributes['security_access_individuals_read'] = userState
      .filter(user => user.permission === 'read')
      .map(user => {
        return user.userName
      })
    attributes['security_access_individuals'] = userState
      .filter(user => user.permission === 'write')
      .map(user => {
        return user.userName
      })
    attributes['security_access_administrators'] = userState
      .filter(user => user.permission === 'admin')
      .map(user => {
        return user.userName
      })
    attributes['metacard_type'] = 'attribute-group'
    return attributes
  }

  return (
    <FormControl style={{ width: '100%' }}>
      <div style={{ maxHeight: '400px', overflow: 'auto', paddingTop: '.5em' }}>
        {userState.map((user, index) => {
          return (
            <UserAddRow
              key={index}
              index={index}
              value={user.userName}
              level={user.permission}
              handleChange={handleChange}
              removeUser={removeUser}
            />
          )
        })}
      </div>
      <Button
        color="primary"
        variant="contained"
        style={{ width: '100%', marginBottom: '.625rem' }}
        onClick={() => {
          setUserState([...userState, { userName: '', permission: 'read' }])
        }}
      >
        + new user
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
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => {
              useSave({
                variables: { id, attrs: convertState(userState) },
              })
            }}
          >
            Save Users
          </Button>
        </Grid>
      </Grid>
    </FormControl>
  )
}
