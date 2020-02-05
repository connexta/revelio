import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import UserAddRow from './user-add-row'

export const UserSharePanel = props => {
  const [numOfRows, setNumOfRows] = React.useState(1)
  const [sharing, setSharing] = React.useState({})
  const { individuals = {} } = props
  return (
    <FormControl style={{ width: '100%' }}>
      <div style={{ maxHeight: '400px', overflow: 'auto', paddingTop: '.5em' }}>
        {Object.keys(individuals).map(permission => {
          if (Array.isArray(individuals[permission])) {
            return individuals[permission].map((user, index) => {
              return <UserAddRow key={index} value={user} level={permission} />
            })
          }
        })}
        {Array(numOfRows).fill(<UserAddRow />)}
      </div>
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
    </FormControl>
  )
}

export default UserSharePanel
