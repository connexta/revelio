import React, { useState, useContext } from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import {
  MetacardInteractionsDialogContext,
  MetacardInteraction,
} from '../metacard-interaction'

const ConfirmDeleteAction = props => {
  const [open, setOpen] = useState(false)
  const { permissions } = props
  if (!permissions.canWrite) {
    return null
  }
  return (
    <Box
      onClick={e => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      <Dialog open={open}>
        <ConfirmDeleteDialog {...props} closeDialog={() => setOpen(false)} />
      </Dialog>
      <IconButton onClick={() => setOpen(true)}>
        <DeleteIcon />
      </IconButton>
    </Box>
  )
}

const ConfirmDeleteMetacardInteraction = props => {
  const { setDialogProps } = useContext(MetacardInteractionsDialogContext)
  const { permissions } = props
  if (!permissions.canWrite) {
    return null
  }
  const { itemName } = props
  return (
    <Box
      onClick={() => {
        setDialogProps({
          open: true,
          children: (
            <ConfirmDeleteDialog
              {...props}
              closeDialog={() => {
                setDialogProps({ open: false })
              }}
            />
          ),
        })
      }}
    >
      <MetacardInteraction Icon={DeleteIcon} message={`Delete ${itemName}`} />
    </Box>
  )
}

const ConfirmDeleteDialog = props => {
  const { itemName, onDelete, closeDialog } = props

  return (
    <React.Fragment>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will permanently delete the {itemName}.
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ textAlign: 'center' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            closeDialog()
          }}
        >
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            if (typeof onDelete === 'function') {
              onDelete()
            }
            closeDialog()
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </React.Fragment>
  )
}

export { ConfirmDeleteAction, ConfirmDeleteMetacardInteraction }
