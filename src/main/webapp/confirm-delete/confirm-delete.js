import React, { Fragment, useState } from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

import Button from '@material-ui/core/Button'

const ConfirmDelete = props => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { children, onDelete } = props

  return (
    <Fragment>
      {confirmDelete ? (
        <Dialog
          open
          onClick={e => e.stopPropagation()}
          onClose={() => setConfirmDelete(false)}
        >
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText>{children}</DialogContentText>
          </DialogContent>
          <DialogActions style={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setConfirmDelete(false)
              }}
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                onDelete()
                setConfirmDelete(false)
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
      <IconButton
        onClick={e => {
          e.stopPropagation()
          setConfirmDelete(true)
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Fragment>
  )
}

export default ConfirmDelete
