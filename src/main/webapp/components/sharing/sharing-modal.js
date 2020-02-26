import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Container from './container'
import ShareIcon from '@material-ui/icons/Share'

export default props => {
  const [sharing, setSharing] = React.useState(false)
  const { id, title, metacardType } = props
  return (
    <div>
      {sharing ? (
        <Dialog
          fullWidth={true}
          open={sharing}
          onClose={() => {
            setSharing(false)
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
              metacardType={metacardType}
              handleClose={() => {
                setSharing(false)
              }}
            />
          </DialogContent>
        </Dialog>
      ) : null}
      <IconButton
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
          setSharing(true)
        }}
      >
        <ShareIcon />
      </IconButton>
    </div>
  )
}
