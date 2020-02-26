import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import UserAddRow from './user-add-row'

export default props => {
  const { state, handleChange, removeUser, addUser } = props

  return (
    <FormControl style={{ width: '100%' }}>
      <div style={{ maxHeight: '400px', overflow: 'auto', paddingTop: '.5em' }}>
        {state.map((user, index) => {
          return (
            <UserAddRow
              key={index}
              index={index}
              value={user.label}
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
          addUser('user')
        }}
      >
        + new user
      </Button>
    </FormControl>
  )
}
