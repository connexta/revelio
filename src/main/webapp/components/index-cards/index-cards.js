import React from 'react'

import Typography from '@material-ui/core/Typography'

import IconButton from '@material-ui/core/IconButton'

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import EditIcon from '@material-ui/icons/Edit'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardActionArea from '@material-ui/core/CardActionArea'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import { usePermissions } from '../../react-hooks'

import { CustomTooltip } from '../tooltip'

import { ShareAction } from '../sharing/sharing-modal'

import { ConfirmDeleteAction as DeleteAction } from '../confirm-delete'

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
export const DuplicateAction = props => {
  const { onDuplicate } = props
  return (
    <IconButton onClick={onClick(onDuplicate)}>
      <CustomTooltip title="Duplicate">
        <FileCopyIcon />
      </CustomTooltip>
    </IconButton>
  )
}

export { ShareAction, DeleteAction }

export const Actions = props => {
  const getPermissions = usePermissions(props)

  if (!getPermissions) {
    return null
  }
  const actions = React.Children.map(props.children, child => {
    return React.isValidElement(child)
      ? React.cloneElement(child, {
          permissions: getPermissions(props.attributes),
        })
      : null
  })

  return <CardActions>{actions}</CardActions>
}

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
    <ItemContainer onClick={onClick}>
      <CardActionArea
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <AddCircleOutlineIcon style={{ width: '50%', height: '50%' }} />
      </CardActionArea>
    </ItemContainer>
  )
}

const StyledCardHeader = withStyles({
  content: {
    width: '100%',
    flex: '1 1 auto',
  },
})(CardHeader)

export const IndexCardItem = props => {
  const {
    headerAction,
    title,
    subHeader,
    metacard_owner,
    modified,
    children,
    onClick,
    titleTypographyProps,
  } = props

  return (
    <ItemContainer onClick={onClick}>
      <CardActionArea component={'div'}>
        <StyledCardHeader
          title={title}
          subheader={subHeader || moment(modified).fromNow()}
          action={headerAction}
          titleTypographyProps={titleTypographyProps}
        />
        {metacard_owner && (
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              Owner: {metacard_owner}
            </Typography>
          </CardContent>
        )}
      </CardActionArea>
      {children}
    </ItemContainer>
  )
}

export const IndexCards = props => {
  const { children } = props
  return <div style={{ display: 'flex', flexWrap: 'wrap' }}>{children}</div>
}
