import { useState } from 'react'

type UseAnchorElProps = {
  onClose?: () => void
}

//Used as shorthand for anchorEl logic on Material UI Menus/Popovers
const useAnchorEl = (props: UseAnchorElProps = {}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open: any = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const close = () => {
    setAnchorEl(null)
    if (props.onClose) {
      props.onClose()
    }
  }

  const isOpen = Boolean(anchorEl)
  return [anchorEl, open, close, isOpen]
}

export default useAnchorEl
