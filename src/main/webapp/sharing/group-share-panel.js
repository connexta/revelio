import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import GroupAddRow from './group-add-row'

export default props => {
  const { userRoles = [], state, addGroup, removeGroup, handleChange } = props

  return (
    <FormControl style={{ width: '100%' }}>
      <div style={{ maxHeight: '400px', overflow: 'auto', paddingTop: '.5em' }}>
        {state.map((group, index) => {
          return (
            <GroupAddRow
              key={index}
              index={index}
              value={group.label}
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
          addGroup('group')
        }}
      >
        + new group
      </Button>
    </FormControl>
  )
}
