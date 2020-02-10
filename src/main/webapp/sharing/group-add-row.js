import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import AutoComplete from '@material-ui/lab/AutoComplete'

const permissionLevels = [
  {
    value: 'read',
    label: 'Can read',
  },
  {
    value: 'write',
    label: 'Can write',
  },
]

export const GroupAddRow = props => {
  const {
    value = '',
    level = '',
    userRoles = [],
    index,
    handleChange,
    removeGroup,
  } = props
  return (
    <Grid
      spacing={2}
      style={{ marginBottom: '.625rem', width: '100%' }}
      justify="flex-start"
      container
    >
      <Grid item xs={6}>
        <AutoComplete
          options={userRoles}
          getOptionLabel={option => option}
          defaultValue={value}
          onChange={e => {
            handleChange(e, index, 'groupName')
          }}
          renderInput={params => (
            <TextField {...params} label="Group" variant="outlined" fullWidth />
          )}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          select
          label="Permission"
          value={level}
          onChange={e => {
            handleChange(e, index, 'permission')
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
      <Grid item xs={2}>
        <Button
          color="primary"
          variant="contained"
          style={{ position: 'relative', height: '100%', width: '100%' }}
          onClick={e => {
            removeGroup(index)
          }}
        >
          Remove
        </Button>
      </Grid>
    </Grid>
  )
}

export default GroupAddRow
