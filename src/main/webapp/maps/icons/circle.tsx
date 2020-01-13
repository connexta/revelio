import * as React from 'react'

type Props = {
  color: string
}

const DrawIcon: React.SFC<Props> = ({ color }) => (
  <svg width="30px" height="30px" x="0px" y="0px" viewBox="0 0 360 360">
    <circle fill={color} cx="181" cy="186.5" r="24.7" />
    <path
      fill={color}
      d="M178.9,66.2c-67,0-121.3,54.3-121.3,121.3s54.3,121.3,121.3,121.3s121.3-54.3,121.3-121.3	S245.9,66.2,178.9,66.2z M178.9,295.5c-59.6,0-108-48.3-108-108s48.3-108,108-108c59.6,0,108,48.3,108,108S238.5,295.5,178.9,295.5z"
    />
    <rect x="185.9" y="180.5" fill={color} width="110.7" height="12" />
  </svg>
)

export default DrawIcon
