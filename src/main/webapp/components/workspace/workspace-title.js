import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import React from 'react'

//eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(theme => ({
  resize: {
    fontSize: '2em',
  },
}))

export default props => {
  const { title, saving, saveWorkspace, queries } = props
  const classes = useStyles()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
      }}
    >
      <TextField
        variant="outlined"
        style={{ margin: '10px', width: '70%' }}
        defaultValue={title}
        onBlur={e => {
          saveWorkspace({ title: e.target.value, queries })
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            saveWorkspace({ title: e.target.value, queries })
          }
        }}
        InputProps={{
          classes: {
            input: classes.resize,
          },
        }}
      />
      {saving ? (
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <CircularProgress size={30} />
          <Typography
            variant="body1"
            style={{ paddingLeft: 10, paddingRight: 5 }}
          >
            Saving
          </Typography>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <CheckCircleIcon style={{ marginTop: '10px' }} color="primary" />
          <Typography variant="body1" style={{ paddingLeft: 10 }}>
            Saved
          </Typography>
        </div>
      )}
    </div>
  )
}
