import * as React from 'react'
import StarIcon from '@material-ui/icons/Star'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import { MetacardInteraction } from '../metacard-interaction'
import { SvgIconProps } from '@material-ui/core/SvgIcon'

type DefaultFormInteractionProps = {
  onToggle: (e: React.SyntheticEvent) => void
  isDefault?: boolean
}

const DefaultFormInteraction = (props: DefaultFormInteractionProps) => {
  const { onToggle, isDefault } = props
  if (typeof onToggle !== 'function') {
    return null
  }
  const Icon = isDefault ? StarBorderIcon : StarIcon
  const message = `${isDefault ? 'Clear' : 'Make'} Default Form`
  return (
    <MetacardInteraction
      Icon={(props: SvgIconProps) => (
        <Icon {...props} style={{ ...props.style, color: '#FFBF00' }} />
      )}
      onClick={e => {
        e.stopPropagation()
        e.preventDefault()
        onToggle(e)
      }}
      message={message}
    />
  )
}

export default DefaultFormInteraction
