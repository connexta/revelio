import RefreshIcon from '@material-ui/icons/Refresh'
import * as React from 'react'
import { MetacardInteraction } from '../../metacard-interaction'

export default props => {
  return (
    <MetacardInteraction
      Icon={RefreshIcon}
      onClick={props.onRefresh}
      message={props.message}
    />
  )
}
