import * as React from 'react'

type Props = {
  color: string
}

const DrawIcon: React.SFC<Props> = ({ color }) => (
  <svg width="30px" height="30px" x="0px" y="0px" viewBox="0 0 360 360">
    <polygon
      fill="none"
      stroke={color}
      strokeWidth="15"
      strokeMiterlimit="10"
      points="100.5,279.1 54.7,103.9 168.3,167 291.7,49.5 274.5,270.2"
    />
  </svg>
)

export default DrawIcon
