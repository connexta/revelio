import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import GroupAddRow from './group-add-row'

export const GroupSharePanel = props => {
  const { groups = {} } = props
  const [numOfRows, setNumOfRows] = React.useState(1)
  return (
    <FormControl style={{ width: '100%' }}>
      <div style={{ maxHeight: '400px', overflow: 'auto', paddingTop: '.5em' }}>
        {Object.keys(groups).map(permission => {
          if (Array.isArray(groups[permission])) {
            return groups[permission].map((user, index) => {
              return <GroupAddRow key={index} value={user} level={permission} />
            })
          }
        })}
        {Array(numOfRows).fill(<GroupAddRow />)}
      </div>
      <GroupAddRow />
      <Button
        color="primary"
        variant="contained"
        style={{ width: '100%', marginBottom: '.625rem' }}
        onClick={() => {
          setNumOfRows(numOfRows + 1)
        }}
      >
        + new group
      </Button>
    </FormControl>
  )
}

export default GroupSharePanel
