import React, { createContext, useState, Fragment } from 'react'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import { MenuItem, Box, Dialog } from '@material-ui/core'
import { DialogProps } from '@material-ui/core/Dialog'

const MetacardInteractionsDialogContext = createContext<any>({
  setProps: () => {
    // eslint-ignore
    console.error(
      'You are trying to set props on a dialog without a MetacardInteractionsDialogContext provider. Make sure the provider is included somewhere in a parent component'
    )
  },
  children: <Fragment />,
})

type MetacardInteractionsDropdownProps = {
  children: React.ReactNode
}

const MetacardInteractionsDropdown = (
  props: MetacardInteractionsDropdownProps
) => {
  const [anchorEl, open, close, isOpen] = useAnchorEl()

  return (
    <MetacardInteractionsDialog>
      <Box
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
        style={{ marginLeft: 'auto' }}
      >
        <IconButton onClick={open}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={isOpen} onClose={close}>
          {React.Children.map(props.children, child => {
            return (
              <MenuItem
                disableGutters
                // Set the padding to 0 because if the child is null (i.e. metacard interaction not enabled),
                // the item will still be visible because of the default padding on menu items
                style={{ padding: 0 }}
                onClick={() => close()}
              >
                {child}
              </MenuItem>
            )
          })}
        </Menu>
      </Box>
    </MetacardInteractionsDialog>
  )
}

type MetacardInteractionsDialogProps = {
  children: React.ReactNode
}

const MetacardInteractionsDialog = (props: MetacardInteractionsDialogProps) => {
  const [dialogProps, setDialogProps] = useState<DialogProps>({
    children: <Fragment />,
    open: false,
  })

  return (
    <MetacardInteractionsDialogContext.Provider value={{ setDialogProps }}>
      {props.children}
      <Dialog
        {...dialogProps}
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      />
    </MetacardInteractionsDialogContext.Provider>
  )
}

export { MetacardInteractionsDropdown, MetacardInteractionsDialogContext }
