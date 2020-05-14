import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    border: '1px solid #D3D3D3',
  },
}))(Tooltip)

export const CustomTooltip = props => {
  return <LightTooltip title={props.title}>{props.children}</LightTooltip>
}
