import React from 'react'

import Typography from '@material-ui/core/Typography'

import IconButton from '@material-ui/core/IconButton'

import ShareIcon from '@material-ui/icons/Share'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import EditIcon from '@material-ui/icons/Edit'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardActionArea from '@material-ui/core/CardActionArea'

import moment from 'moment'

import ConfirmDelete from '../confirm-delete'

const onClick = action => e => {
  e.preventDefault()
  e.stopPropagation()
  if (typeof action === 'function') {
    action(e)
  }
}

export const EditAction = props => {
  const { onEdit } = props
  return (
    <IconButton onClick={onClick(onEdit)}>
      <EditIcon />
    </IconButton>
  )
}

export const DeleteAction = props => {
  const { onDelete } = props
  return (
    <ConfirmDelete onDelete={onDelete}>
      This will permanently delete the search form.
    </ConfirmDelete>
  )
}

export const ShareAction = props => {
  const { onShare } = props
  return (
    <IconButton onClick={onClick(onShare)}>
      <ShareIcon />
    </IconButton>
  )
}

export const Actions = CardActions

const ItemContainer = props => {
  const { children, style, onClick } = props

  return (
    <Card
      style={{
        width: 345,
        margin: 20,
        cursor: 'pointer',
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </Card>
  )
}

export const AddCardItem = props => {
  const { onClick } = props

  return (
    <ItemContainer
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClick}
    >
      <AddCircleOutlineIcon style={{ width: '50%', height: '50%' }} />
    </ItemContainer>
  )
}

export const IndexCardItem = props => {
  const { title, subHeader, owner, modified, children, onClick } = props

  return (
    <ItemContainer onClick={onClick}>
      <CardActionArea>
        <CardHeader
          title={title}
          subheader={subHeader || moment(modified).fromNow()}
        />
        <CardContent>
          {owner && (
            <Typography variant="body2" color="textSecondary" component="p">
              Owner: {owner}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      {children}
    </ItemContainer>
  )
}

export const IndexCards = props => {
  const { children } = props
  return <div style={{ display: 'flex', flexWrap: 'wrap' }}>{children}</div>
}
