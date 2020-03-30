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
import { ListCreatePopover } from './list-create'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import React from 'react'
import { ConfirmDeleteAction as DeleteAction } from '../confirm-delete'
import { Actions, EditAction, IndexCardItem } from '../index-cards'
import { useApolloFallback } from '../../react-hooks'

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

const saveLists = (lists, listToAdd, isNewList) => {
  if (isNewList && lists) {
    lists.forEach(list => {
      delete list['__typename']
    })
    return [...lists, listToAdd]
  } else if (isNewList && lists == undefined) {
    return [listToAdd]
  } else {
    lists.forEach(list => {
      if (list.id === listToAdd.id) {
        Object.assign(list, listToAdd)
      }
      delete list['__typename']
    })
    return lists
  }
}

const Lists = props => {
  const { onSelect, lists, isLoading, onSave } = props
  const [selected, setSelected] = React.useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [
    editorAnchorEl,
    handleEditorOpen,
    handleEditorClose,
    isEditorOpen,
  ] = useAnchorEl()

  if (lists == undefined) {
    return (
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Typography color="textSecondary">
          You don&apos;t have any lists. Search for something and add it to a
          list or create a
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditorOpen}
            style={{ marginLeft: '5px' }}
          >
            new list
          </Button>
          .
        </Typography>
        <ListCreatePopover
          anchorEl={editorAnchorEl}
          onClose={handleEditorClose}
          open={isEditorOpen}
          onSave={(list, isNewList) => {
            onSave(saveLists(props.lists, list, isNewList))
          }}
        />
      </div>
    )
  }
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
    ? lists.map((list, index) => {
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

        return list['list_bookmarks'] == undefined ? (
          <IndexCardItem
            key={list.id}
            title={<Title />}
            subHeader={<div>Empty</div>}
            onClick={() => {
              handleClick(list)
            }}
          >
            <Actions>
              <DeleteAction />
            </Actions>
          </IndexCardItem>
        ) : (
          <React.Fragment>
            <IndexCardItem
              key={list.id}
              title={<Title />}
              subHeader={<ListInfo listSize={list['list_bookmarks'].length} />}
              onClick={() => {
                handleClick(list)
              }}
            >
              <Actions>
                <EditAction onEdit={handleEditorOpen} />
                <DeleteAction itemName="list" isWritable={true} />
              </Actions>
            </IndexCardItem>
            <ListCreatePopover
              key={index}
              list={list}
              anchorEl={editorAnchorEl}
              onClose={handleEditorClose}
              open={isEditorOpen}
              onSave={(list, isNewList) => {
                onSave(saveLists(props.lists, list, isNewList))
              }}
            />
          </React.Fragment>
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
