import React, { useState } from 'react'

import Skeleton from '@material-ui/lab/Skeleton'
import BrokenImageIcon from '@material-ui/icons/BrokenImage'

const isEmptySource = src => {
  return src === undefined || src === null || src === ''
}

const Thumbnail = props => {
  const { src, style } = props
  const [status, setStatus] = useState('loading')

  if (isEmptySource(src)) {
    return null
  }

  return (
    <React.Fragment>
      {status === 'loading' ? <Skeleton variant="rect" height="100px" /> : null}
      <img
        style={{
          display: status === 'success' ? 'block' : 'none',
          maxHeight: 100,
          maxWidth: '100%',
          ...style,
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
