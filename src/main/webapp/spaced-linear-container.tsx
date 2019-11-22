import * as React from 'react'
import Box from '@material-ui/core/Box'

type Props = any & {
  direction: 'row' | 'column'
  spacing: number
  children: React.ReactNode
  childStyle?: object
}

const SpacedLinearContainer: React.SFC<Props> = ({
  direction,
  spacing,
  children,
  childStyle,
  ...rest
}) => {
  const count = React.Children.count(children)
  const childSpacing = (index: number) => (index < count - 1 ? spacing : 0)
  const zeroSpacing = () => 0
  const bottomSpacing = direction === 'column' ? childSpacing : zeroSpacing
  const rightSpacing = direction === 'row' ? childSpacing : zeroSpacing
  return (
    <Box display="flex" flexDirection={direction} {...rest}>
      {React.Children.map(children, (child: React.ReactNode, index: number) => (
        <Box
          mb={bottomSpacing(index)}
          mr={rightSpacing(index)}
          style={childStyle}
        >
          {child}
        </Box>
      ))}
    </Box>
  )
}

export default SpacedLinearContainer
