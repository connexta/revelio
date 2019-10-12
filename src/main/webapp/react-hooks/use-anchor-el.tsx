import { useState } from 'react'

//Used as shorthand for anchorEl logic on Material UI Menus/Popovers
const useAnchorEl = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open: any = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const close = () => {
    setAnchorEl(null)
  }
  return [anchorEl, open, close]
}

export default useAnchorEl
