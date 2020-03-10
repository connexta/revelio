import React from 'react'
import EmailIcon from '@material-ui/icons/Email'
import IconButton from '@material-ui/core/IconButton'
import { CustomTooltip } from '../tooltip/tooltip'
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined'
import { getIn } from 'immutable'

const subscribeToWorkspace = async props => {
  const { id, title, setMessage, subscribe, setSubscribed } = props
  const res = await subscribe({ variables: { id } })
  if (getIn(res, ['data', 'subscribeToWorkspace'], 0) === 200) {
    setSubscribed(true)
    setMessage(`Subscribed to ${title}`)
  } else {
    setSubscribed(false)
    setMessage(`Could not subscribed to ${title}`)
  }
}

const unsubscribeFromWorkspace = async props => {
  const { id, title, setMessage, unsubscribe, setSubscribed } = props
  const res = await unsubscribe({ variables: { id } })

  if (getIn(res, ['data', 'unsubscribeFromWorkspace'], 0) === 200) {
    setSubscribed(false)
    setMessage(`Unsubscribed from ${title}`)
  } else {
    setSubscribed(true)
    setMessage(`Could not unsubscribe from ${title}`)
  }
}

export default props => {
  const { subscribe, unsubscribe, id, title, setMessage } = props
  const [subscribed, setSubscribed] = React.useState(props.isSubscribed)

  return (
    <CustomTooltip title={subscribed ? 'Unsubscribe' : 'Subscribe'}>
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
              })
            : await subscribeToWorkspace({
                id,
                title,
                setMessage,
                subscribe,
                setSubscribed,
              })
        }}
      >
        {subscribed ? <EmailOutlinedIcon /> : <EmailIcon />}
      </IconButton>
    </CustomTooltip>
  )
}
