import { useLazyQuery } from '@apollo/react-hooks'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import gql from 'graphql-tag'
import React from 'react'
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

const Lists = props => {
  const { onSelect, lists, isLoading } = props
  const [selected, setSelected] = React.useState(null)

  return (
    lists &&
    lists.map(list => {
      const isSelected = list.id === selected
      return (
        <React.Fragment key={list.id}>
          <MenuItem
            onClick={() => {
              setSelected(list.id)
              onSelect(list['list_bookmarks'])
            }}
            selected={isSelected}
          >
            <ListItemText primary={list.title} secondary="Has not been run" />
            {isLoading &&
              isSelected && (
                <ListItemIcon>
                  <CircularProgress size={25} />
                </ListItemIcon>
              )}
          </MenuItem>
          <Divider />
        </React.Fragment>
      )
    })
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
