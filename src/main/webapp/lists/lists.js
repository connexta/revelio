import { useLazyQuery } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import ArchiveIcon from '@material-ui/icons/Archive'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FolderIcon from '@material-ui/icons/Folder'
import gql from 'graphql-tag'
import React from 'react'
import {
  Actions,
  DeleteAction,
  EditAction,
  IndexCardItem,
} from '../index-cards'
import { useApolloFallback } from '../react-hooks'

const searchByID = gql`
  query SearchByID($ids: [ID]!) {
    metacardsById(ids: $ids) {
      results {
        actions {
          id
          url
          title
          displayName
        }
        metacard
      }
    }
  }
`

const ListIconMap = {
  archive: ArchiveIcon,
  folder: FolderIcon,
}

const ListTitle = props => {
  const { title, icon } = props
  const Icon = ListIconMap[icon]

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {Icon ? (
        <React.Fragment>
          <Icon /> <div style={{ width: 5 }} />
        </React.Fragment>
      ) : null}

      {title}
      <div style={{ flexGrow: 1 }} />
      {props.children}
    </div>
  )
}

const ListInfo = props => {
  const { listSize } = props
  return <Typography>{`${listSize} results`}</Typography>
}

const Lists = props => {
  const { onSelect, lists, isLoading } = props
  const [selected, setSelected] = React.useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = list => {
    setSelected(list.id)
    onSelect(list['list_bookmarks'])
  }

  const open = Boolean(anchorEl)

  const ListCards = lists
    ? lists.map(list => {
        const isSelected = list.id === selected

        const Title = () => (
          <ListTitle title={list.title} icon={list['list_icon']}>
            {isLoading &&
              isSelected && (
                <ListItemIcon>
                  <CircularProgress size={25} />
                </ListItemIcon>
              )}
          </ListTitle>
        )

        return (
          <IndexCardItem
            key={list.id}
            title={<Title />}
            subHeader={<ListInfo listSize={list['list_bookmarks'].length} />}
            onClick={() => {
              handleClick(list)
            }}
          >
            <Actions>
              <EditAction />
              <DeleteAction />
            </Actions>
          </IndexCardItem>
        )
      })
    : []

  return (
    lists && (
      <React.Fragment>
        <div style={{ display: 'flex' }}>
          {selected
            ? ListCards.filter(list => list.key === selected)[0]
            : ListCards[0]}
          <Button
            color="primary"
            variant="contained"
            style={{ marginTop: 20, marginBottom: 20, marginRight: 20 }}
            onClick={handleOpen}
          >
            <ExpandMoreIcon />
          </Button>
        </div>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {ListCards}
        </Popover>
      </React.Fragment>
    )
  )
}

const Container = props => {
  const [onSearchById, { loading }] = useLazyQuery(searchByID, {
    onCompleted: data => {
      props.onSelect(data)
    },
  })

  const onSearch = ids => {
    onSearchById({ variables: { ids } })
  }

  return (
    <Lists {...props} onSelect={ids => onSearch(ids)} isLoading={loading} />
  )
}

export default props => {
  const Component = useApolloFallback(Container, Lists)
  return <Component {...props} />
}
