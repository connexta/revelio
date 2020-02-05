import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import GroupAddRow from './group-add-row'

export const GroupSharePanel = props => {
  return (
    <FormControl style={{ width: '100%' }}>
      <GroupAddRow />
      <Button
        color="primary"
        variant="contained"
        style={{ width: '100%', marginBottom: '.625rem' }}
      >
        + new group
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

export default GroupSharePanel
