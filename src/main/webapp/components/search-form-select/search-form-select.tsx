import * as React from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import SearchIcon from '@material-ui/icons/FindInPage'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import Collapse from '@material-ui/core/Collapse'
import { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import { QueryType } from '../query-builder/types'
import matchesFilter from '../../utils/matches-filter'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { getIn } from 'immutable'
import { ApolloError } from 'apollo-client'
import { InlineRetry } from '../network-retry'

type SectionProps = {
  title: string
  searchForms: QueryType[]
  startOpen?: boolean
  onSelect: (query: QueryType) => void
}
type SearchFormSelectProps = {
  searchForms: QueryType[]
  loading?: boolean
  error?: ApolloError
  userEmail?: string
  onSelect: (query: QueryType) => void
  refetch?: () => void
}
type ContainerProps = {
  onSelect: (query: QueryType) => void
}

type SearchFormListProps = {
  searchForms: QueryType[]
  userEmail?: string
  onSelect: (query: QueryType) => void
}

const Section = (props: SectionProps) => {
  const [open, setOpen] = useState(props.startOpen || false)
  const Arrow = open ? KeyboardArrowUpIcon : KeyboardArrowDownIcon
  const { searchForms, onSelect } = props

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
          {searchForms.map((form, index) => {
            return (
              <Button
                key={form.id || index}
                onClick={() => {
                  const { id: _, metacard_owner: _a, ...formAttrs } = form
                  onSelect(formAttrs)
                }}
                style={{ textAlign: 'left', width: '100%' }}
              >
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

const SearchFormList = (props: SearchFormListProps) => {
  const [filterText, setFilterText] = useState('')
  const { searchForms, onSelect, userEmail } = props

  const searchFormsFilteredByText = searchForms.filter(searchForm =>
    matchesFilter({ filterText, str: searchForm.title || '' })
  )
  return (
    <React.Fragment>
      <TextField
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        variant="outlined"
        fullWidth
        placeholder="Type to filter"
      />
      <Section
        onSelect={onSelect}
        searchForms={searchFormsFilteredByText.filter(
          form => form.metacard_owner === userEmail
        )}
        startOpen
        title={'My Search Forms'}
      />
      <Section
        onSelect={onSelect}
        searchForms={searchFormsFilteredByText.filter(
          form =>
            form.metacard_owner !== userEmail &&
            form.metacard_owner !== 'system'
        )}
        title={'Shared Search Forms'}
      />
      <Section
        onSelect={onSelect}
        searchForms={searchFormsFilteredByText.filter(
          form => form.metacard_owner === 'system'
        )}
        title={'System Search Forms'}
      />
    </React.Fragment>
  )
}

export const SearchFormSelect = (props: SearchFormSelectProps) => {
  const [anchorEl, handleOpen, handleClose, isOpen] = useAnchorEl()
  const { searchForms, loading, error, refetch, onSelect, userEmail } = props
  const PopoverContent = () => {
    if (loading) {
      return <LinearProgress />
    }
    if (error) {
      return <InlineRetry error={error} onRetry={refetch} />
    }
    return (
      <SearchFormList
        onSelect={onSelect}
        searchForms={searchForms}
        userEmail={userEmail}
      />
    )
  }

  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: 'fit-content',
        }}
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
          handleOpen(e)
        }}
      >
        <SearchIcon style={{ marginRight: 10 }} />
        <ListItemText>Use Another Search Form</ListItemText>
      </div>
      <Popover
        anchorEl={anchorEl}
        open={isOpen}
        onClose={(e: React.SyntheticEvent) => {
          e.stopPropagation()
          handleClose(e)
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <div
          style={{ minWidth: 200, padding: 10 }}
          onClick={e => e.stopPropagation()}
        >
          <PopoverContent />
        </div>
      </Popover>
    </React.Fragment>
  )
}

const query = gql`
  query SearchFormSelect {
    metacardsByTag(tag: "query-template") {
      attributes {
        id
        title
        filterTree
        sorts
        sources
        detail_level
        metacard_owner
        metacard_tags
      }
    }
    user {
      email
    }
  }
`

const Container = (props: ContainerProps) => {
  const { loading, error, data, refetch } = useQuery(query)
  const searchForms = getIn(data, ['metacardsByTag', 'attributes'], []).map(
    (form: any) => {
      const { __typename: _, metacard_tags, ...baseForm } = form
      if (metacard_tags && metacard_tags.includes('system-template')) {
        return { ...baseForm, metacard_owner: 'system' }
      }
      return baseForm
    }
  )
  const email = getIn(data, ['user', 'email'], undefined)

  return (
    <SearchFormSelect
      onSelect={props.onSelect}
      userEmail={email}
      refetch={refetch}
      searchForms={searchForms}
      loading={loading}
      error={error}
    />
  )
}

export default Container
