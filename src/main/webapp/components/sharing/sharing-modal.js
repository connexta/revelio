import React, { useState, useContext } from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Container from './container'
import ShareIcon from '@material-ui/icons/Share'
import Box from '@material-ui/core/Box'

import {
  MetacardInteractionsDialogContext,
  MetacardInteraction,
} from '../metacard-interaction'

const ShareMetacardInteraction = props => {
  if (!props.isAdmin) {
    return null
  }
  const { setDialogProps } = useContext(MetacardInteractionsDialogContext)
  return (
    <Box
      onClick={() => {
        setDialogProps({
          open: true,
          fullWidth: true,
          children: (
            <SharingModal
              {...props}
              closeDialog={() => {
                setDialogProps({ open: false })
              }}
            />
          ),
        })
      }}
    >
      <MetacardInteraction Icon={ShareIcon} message="View Sharing" />
    </Box>
  )
}

const ShareAction = props => {
  const [open, setOpen] = useState(false)
  if (!props.isAdmin) {
    return null
  }
  return (
    <Box
      onClick={e => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      <Dialog fullWidth open={open}>
        <SharingModal {...props} closeDialog={() => setOpen(false)} />
      </Dialog>
      <IconButton onClick={() => setOpen(true)}>
        <ShareIcon />
      </IconButton>
    </Box>
  )
}

const SharingModal = props => {
  const { id, title, metacardType, closeDialog } = props
  return (
    <React.Fragment>
      <DialogTitle style={{ textAlign: 'center' }}>
        {`"${title}" Access`}
      </DialogTitle>
      <DialogContent>
        <Container
          id={id}
          title={title}
          metacardType={metacardType}
          handleClose={() => {
            closeDialog()
          }}
        />
      </DialogContent>
    </React.Fragment>
  )
}

export { ShareAction, ShareMetacardInteraction }
