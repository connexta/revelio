import React from 'react'
import FolderIcon from '@material-ui/icons/Folder'
import ArchiveIcon from '@material-ui/icons/Archive'
import CodeIcon from '@material-ui/icons/Code'
import ListIcon from '@material-ui/icons/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import FormLabel from '@material-ui/core/FormLabel'

const iconList = {
  Folder: <FolderIcon />,
  Code: <CodeIcon />,
  Archive: <ArchiveIcon />,
  Tasks: <ListIcon />,
}

const ListType = props => {
  const { label } = props
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <ListItemIcon>{iconList[label]}</ListItemIcon>
      <ListItemText primary={label} />
    </div>
  )
}

export const ListCreate = props => {
  const [listIcon, setListIcon] = React.useState('Folder')
  const [useFilter, setUseFilter] = React.useState(false)
  const { anchorEl, onClose, title = '' } = props
  const handleChange = event => {
    setListIcon(event.target.value)
  }
  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <TextField
        style={{ marginBottom: '20px' }}
        variant="outlined"
        label="Title"
        value={title}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
        }}
      >
        <FormLabel style={{ marginBottom: '10px' }}>
          Limit based on filter
        </FormLabel>
        {useFilter ? (
          <ButtonGroup style={{ marginBottom: '20px' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setUseFilter(true)
              }}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setUseFilter(false)
              }}
            >
              No
            </Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup style={{ marginBottom: '20px' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setUseFilter(true)}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setUseFilter(false)}
            >
              No
            </Button>
          </ButtonGroup>
        )}
      </div>
      <TextField
        select
        variant="outlined"
        label="List Icon"
        value={listIcon}
        onChange={handleChange}
        style={{ marginBottom: '20px' }}
      >
        {Object.keys(iconList).map(item => {
          return (
            <MenuItem key={item} value={item}>
              <ListType label={item} />
            </MenuItem>
          )
        })}
      </TextField>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Button variant="outlined" color="primary" style={{ width: '49%' }}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" style={{ width: '49%' }}>
          Save
        </Button>
      </div>
    </FormControl>
  )
}
