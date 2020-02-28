import React from 'react'
import EmailIcon from '@material-ui/icons/Email'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined'
import { getIn } from 'immutable'

const subscribeToWorkspace = async props => {
  const { id, title, setMessage, subscribe, setSubscribed, subscribed } = props
  const res = await subscribe({ variables: { id } })
  getIn(res, ['data', 'subscribetoWorkspace'], 0) === 200
    ? setSubscribed({ isSubscribed: true, message: `Subscribed to ${title}` })
    : setSubscribed({
        isSubscribed: false,
        message: `Could not subscribe to ${title}`,
      })
  setMessage(subscribed.message)
}

const unsubscribeFromWorkspace = async props => {
  const {
    id,
    title,
    setMessage,
    unsubscribe,
    setSubscribed,
    subscribed,
  } = props
  const res = await unsubscribe({ variables: { id } })
  getIn(res, ['data', 'unsubscribeFromWorkspace'], 0) === 200
    ? setSubscribed({
        isSubscribed: false,
        message: `Unsubscribed from ${title}`,
      })
    : setSubscribed({
        isSubscribed: true,
        message: `Could not unsubscribe from ${title}`,
      })
  setMessage(subscribed.message)
}
export default props => {
  const { subscribe, unsubscribe, id, title, setMessage } = props
  const [subscribed, setSubscribed] = React.useState({
    isSubscribed: false,
    message: null,
  })

  return (
    <Tooltip title={subscribed.isSubscribed ? 'Unsubscribe' : 'Subscribe'}>
      <IconButton
        onClick={async e => {
          e.stopPropagation()
          e.preventDefault()
          subscribed
            ? await unsubscribeFromWorkspace({
                id,
                title,
                setMessage,
                unsubscribe,
                setSubscribed,
                subscribed,
              })
            : await subscribeToWorkspace({
                id,
                title,
                setMessage,
                subscribe,
                setSubscribed,
                subscribed,
              })
        }}
      >
        {subscribed.isSubscribed ? <EmailOutlinedIcon /> : <EmailIcon />}
      </IconButton>
    </Tooltip>
  )
}
