import * as React from 'react'

type Props = {
  color: string
}

const DrawIcon: React.SFC<Props> = ({ color }) => (
  <svg width="30px" height="30px" x="0px" y="0px" viewBox="0 0 20 20">
    <path fill={color} d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
)

export default DrawIcon
