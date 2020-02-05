import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import UserAddRow from './user-add-row'

export const UserSharePanel = props => {
  const [numOfRows, setNumOfRows] = React.useState(1)
  const { individuals = {} } = props
  return (
    <FormControl style={{ width: '100%' }}>
      {Object.keys(individuals).map(permission => {
        return individuals[permission].map(user => {
          return <UserAddRow value={user} />
        })
      })}
      {Array(numOfRows).fill(<UserAddRow />)}
      <Button
        color="primary"
        variant="contained"
        style={{ width: '100%', marginBottom: '.625rem' }}
        onClick={() => {
          setNumOfRows(numOfRows + 1)
        }}
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
