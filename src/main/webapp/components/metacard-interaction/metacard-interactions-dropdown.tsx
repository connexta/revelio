import Box from '@material-ui/core/Box'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import React, { createContext, Fragment, useState } from 'react'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import { Permissions } from '../../react-hooks/use-get-permissions'

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
  props: MetacardInteractionsDropdownProps & { permissions?: Permissions }
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
                {React.isValidElement(child)
                  ? React.cloneElement(child, {
                      permissions: props.permissions,
                    })
                  : null}
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
    <MetacardInteractionsDialogContext.Provider
      value={{
        setDialogProps: (props: DialogProps) => {
          setDialogProps({ ...props, children: props.children || null })
        },
      }}
    >
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
