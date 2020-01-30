import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Container from './container'
import ShareIcon from '@material-ui/icons/Share'

export const SharingModal = props => {
  const [sharing, isSharing] = React.useState(false)
  const { form } = props
  return (
    <div>
      {sharing ? (
        <Dialog
          open={open}
          onClose={() => {
            isSharing(false)
          }}
        >
          <DialogTitle>{`${form.title} Access`}</DialogTitle>
          <DialogContent>
            <Container
              id={form.id}
              title={form.title}
              handleClose={() => {
                isSharing(false)
              }}
            />
          </DialogContent>
        </Dialog>
      ) : null}
      <IconButton
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
          isSharing(true)
        }}
      >
        <ShareIcon />
      </IconButton>
    </div>
  )
}

export default SharingModal
