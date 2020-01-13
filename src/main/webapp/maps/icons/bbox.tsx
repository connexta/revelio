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
      points="54.7,49.5 291.7,49.5 291.7,279.1 54.7,279.1 54.7,49.5"
    />
  </svg>
)

export default DrawIcon
