import React from 'react'

import Typography from '@material-ui/core/Typography'

import IconButton from '@material-ui/core/IconButton'

import ShareIcon from '@material-ui/icons/Share'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'

import moment from 'moment'

import ConfirmDelete from '../confirm-delete'

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
    <IconButton
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        if (typeof onShare === 'function') {
          onShare()
        }
      }}
    >
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
  const { title, owner, modified, children, onClick } = props

  return (
    <ItemContainer onClick={onClick}>
      <CardHeader title={title} subheader={moment(modified).fromNow()} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Owner: {owner}
        </Typography>
      </CardContent>
      {children}
    </ItemContainer>
  )
}

export const IndexCards = props => {
  const { children } = props
  return <div style={{ display: 'flex', flexWrap: 'wrap' }}>{children}</div>
}
