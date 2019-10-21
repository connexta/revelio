import React, { Fragment } from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

const QuerySelector = props => {
  const { queries, onSelect } = props

  return (
    <div>
      <List>
        {queries.map(query => {
          const { id, title } = query
          return (
            <Fragment key={id}>
              <ListItem
                button
                onClick={() => {
                  onSelect(query)
                }}
              >
                <ListItemText primary={title} secondary="Has not been run" />
              </ListItem>
              <Divider />
            </Fragment>
          )
        })}
      </List>
    </div>
  )
}

export default QuerySelector
