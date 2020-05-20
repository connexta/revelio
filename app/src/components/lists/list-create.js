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
import Button from '@material-ui/core/Button'
import { RadioButton } from '../input'
import Popover from '@material-ui/core/Popover'
import Box from '@material-ui/core/Box'
import { v4 as newUuid } from 'uuid'
import { AudioIcon, ImageIcon, TargetIcon, VideoIcon } from './icons'
import { FilterList } from '../workspace/filters'
import { defaultFilter } from '../query-builder/filter/filter-utils'

const anyTextFilter = { ...defaultFilter, value: '*' }
const iconList = {
  folder: <FolderIcon />,
  code: <CodeIcon />,
  archive: <ArchiveIcon />,
  tasks: <ListIcon />,
  audio: <AudioIcon />,
  image: <ImageIcon />,
  target: <TargetIcon />,
  video: <VideoIcon />,
}

const ListIconType = props => {
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

export const ListCreatePopover = props => {
  const { list, anchorEl, onClose, open, onSave, setList } = props
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box style={{ margin: '10px' }}>
        <ListCreate
          list={list}
          onClose={onClose}
          onSave={onSave}
          setList={setList}
        />
      </Box>
    </Popover>
  )
}

export const ListCreate = props => {
  const { onClose, onSave } = props

  const [list, setList] = React.useState(
    props.list || {
      id: newUuid().replace(/-/g, ''),
      list_icon: 'folder',
      list_bookmarks: [],
      list_cql: undefined,
      query: undefined,
      title: 'Untitled List',
    }
  )
  const [filters, setFilters] = React.useState([anyTextFilter])
  const [showFilters, setShowFilters] = React.useState(false)
  const [filterType, setFilterType] = React.useState('AND')

  const handleIconChange = event => {
    setList({ ...list, list_icon: event.target.value })
  }
  const handleTitleChange = event => {
    setList({ ...list, title: event.target.value })
  }

  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <TextField
        style={{ marginBottom: '20px' }}
        variant="outlined"
        label="Title"
        value={list.title}
        onChange={handleTitleChange}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
        }}
      />
      <RadioButton
        label="Limit based on filter"
        buttonText={[
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ]}
        value={showFilters === true}
        onChange={e => setShowFilters(e)}
      />
      {showFilters ? (
        <React.Fragment>
          <Box display="flex" alignItems="center" justifyContent="center">
            <TextField
              select
              label="Type"
              value={filterType}
              onChange={e => {
                setFilterType(e.target.value)
                setList({
                  ...list,
                  list_cql: `{type=${filterType}, filters=${JSON.stringify(
                    filters
                  )}}`,
                })
              }}
              style={{ height: '100%', width: '50%', padding: '10px' }}
            >
              <MenuItem key="AND" value="AND">
                AND
              </MenuItem>
              <MenuItem key="OR" value="OR">
                OR
              </MenuItem>
            </TextField>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                setList({
                  ...list,
                  list_cql: `{type=${filterType}, filters=${JSON.stringify([
                    ...filters,
                    anyTextFilter,
                  ])}}`,
                })
                setFilters([...filters, anyTextFilter])
              }}
            >
              Add filter
            </Button>
          </Box>
          <Box maxHeight="200px" overflow="auto" marginBottom="25px">
            <FilterList filters={filters} onChange={setFilters} />
          </Box>
        </React.Fragment>
      ) : null}
      <TextField
        select
        variant="outlined"
        label="List Icon"
        value={list.list_icon}
        onChange={handleIconChange}
        style={{ marginBottom: '20px' }}
      >
        {Object.keys(iconList).map(item => {
          return (
            <MenuItem key={item} value={item}>
              <ListIconType label={item} />
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
        <Button
          variant="outlined"
          color="primary"
          style={{ width: '49%' }}
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ width: '49%' }}
          onClick={() => {
            onSave(list)
            props.setList(list)
            onClose()
          }}
        >
          Save
        </Button>
      </div>
    </FormControl>
  )
}
