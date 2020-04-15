import * as React from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import SearchIcon from '@material-ui/icons/FindInPage'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import Collapse from '@material-ui/core/Collapse'
import { useState } from 'react'
import { Typography } from '@material-ui/core'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import { QueryType } from '../query-builder/types'
import matchesFilter from '../../utils/matches-filter'

type SectionProps = {
  title: string
  searchForms: QueryType[]
  startOpen?: boolean
}

const Section = (props: SectionProps) => {
  const [open, setOpen] = useState(props.startOpen || false)
  const Arrow = open ? KeyboardArrowUpIcon : KeyboardArrowDownIcon
  const { searchForms } = props

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 10,
        }}
      >
        <Typography>{props.title}</Typography>
        <IconButton
          onClick={() => {
            setOpen(!open)
          }}
        >
          <Arrow />
        </IconButton>
      </div>
      <Collapse in={open}>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          {searchForms.map(form => {
            return (
              <Button style={{ textAlign: 'left', width: '100%' }}>
                <Typography style={{ width: '100%', textTransform: 'none' }}>
                  {form.title}
                </Typography>
              </Button>
            )
          })}
        </div>
      </Collapse>
    </div>
  )
}
type SearchFormListProps = {
  searchForms?: QueryType[]
}
const SearchFormList = (props: SearchFormListProps) => {
  const [filterText, setFilterText] = useState('')
  const {
    searchForms = [
      { title: 'Search Form 1' },
      { title: 'Search Form 2' },
      { title: 'Another Search Form' },
      { title: 'Yet Another' },
    ],
  } = props

  const searchFormsFilteredByText = searchForms.filter(searchForm =>
    matchesFilter({ filterText, str: searchForm.title || '' })
  )

  return (
    <div style={{ padding: 10 }}>
      <TextField
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        variant="outlined"
        placeholder="Type to filter"
      />
      <Section
        searchForms={searchFormsFilteredByText}
        startOpen
        title={'My Search Forms'}
      />
      <Section
        searchForms={searchFormsFilteredByText}
        title={'Shared Search Forms'}
      />
      <Section
        searchForms={searchFormsFilteredByText}
        title={'System Search Forms'}
      />
    </div>
  )
}

const SearchFormSelect = () => {
  const [anchorEl, handleOpen, handleClose, isOpen] = useAnchorEl()
  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: 'fit-content',
        }}
        onClick={handleOpen}
      >
        <SearchIcon style={{ marginRight: 10 }} />
        <ListItemText>Use Another Search Form</ListItemText>
      </div>
      <Popover
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <SearchFormList />
      </Popover>
    </React.Fragment>
  )
}

const Container = () => {
  return <SearchFormSelect />
}

export default Container
