import * as React from 'react'

type Props = {
  color: string
}

const DrawIcon: React.SFC<Props> = ({ color }) => (
  <svg width="30px" height="30px" x="0px" y="0px" viewBox="0 0 360 360">
    <rect
      x="59.8"
      y="61"
      transform="rotate(-45.001 93.415 94.593)"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeMiterlimit="10"
      width="67.2"
      height="67.2"
    />
    <rect
      x="216.7"
      y="217.9"
      transform="rotate(-45.001 250.284 251.466)"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeMiterlimit="10"
      width="67.2"
      height="67.2"
    />
    <line
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeMiterlimit="10"
      x1="118"
      y1="117.5"
      x2="227.4"
      y2="226.9"
    />
    <path
      fill={color}
      d="M102.3,47L54.8,94.5l47.5,47.5l47.5-47.5L102.3,47z M68,94.5l34.3-34.3l34.3,34.3l-34.3,34.3L68,94.5z"
    />
    <path
      fill={color}
      d="M257.7,202.4l-47.5,47.5l47.5,47.5l47.5-47.5L257.7,202.4z M223.4,249.9l34.3-34.3l34.3,34.3l-34.3,34.3	L223.4,249.9z"
    />
    <rect
      x="174.5"
      y="94"
      transform="rotate(-45.001 179.504 171.691)"
      fill={color}
      width="10"
      height="155.3"
    />
  </svg>
)

export default DrawIcon
