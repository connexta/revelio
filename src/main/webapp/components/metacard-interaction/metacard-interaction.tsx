import * as React from 'react'
import { Box } from '@material-ui/core'
import { SvgIconProps } from '@material-ui/core/SvgIcon'

type MetacardInteractionProps = {
  Icon: (props: SvgIconProps) => React.ReactElement
  message: string
  onClick: (e: React.SyntheticEvent) => void
}

const MetacardInteraction = (props: MetacardInteractionProps) => {
  const { Icon } = props
  return (
    <Box
      display="flex"
      justifyContent="center"
      onClick={props.onClick}
      style={{ padding: 10 }}
    >
      <Icon style={{ marginRight: 15 }} /> {props.message}
    </Box>
  )
}

export default MetacardInteraction
