import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Container from './container'
import ShareIcon from '@material-ui/icons/Share'

export const SharingModal = props => {
  const [sharing, isSharing] = React.useState(false)
  const { id, title } = props
  return (
    <div>
      {sharing ? (
        <Dialog
          fullWidth={true}
          open={sharing}
          onClose={() => {
            isSharing(false)
          }}
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <DialogTitle style={{ textAlign: 'center' }}>
            {`"${title}" Access`}
          </DialogTitle>
          <DialogContent>
            <Container
              id={id}
              title={title}
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
