import React, { useState } from 'react'

import Skeleton from '@material-ui/lab/Skeleton'
import BrokenImageIcon from '@material-ui/icons/BrokenImage'

const Thumbnail = props => {
  const { src } = props
  const [status, setStatus] = useState('loading')
  return (
    <React.Fragment>
      {status === 'loading' ? <Skeleton variant="rect" height="100px" /> : null}
      <img
        style={{
          display: status === 'success' ? 'block' : 'none',
          maxHeight: 100,
          maxWidth: 150,
        }}
        src={src}
        onLoad={() => setStatus('success')}
        onError={() => setStatus('failed')}
      />
      {status === 'failed' ? <BrokenImageIcon fontSize="large" /> : null}
    </React.Fragment>
  )
}

export default Thumbnail
