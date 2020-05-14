import React from 'react'
import { useSelectionInterface } from '../../react-hooks'
import Checkbox from '@material-ui/core/Checkbox'

export default props => {
  const [selection, onSelect] = useSelectionInterface()
  const { id } = props
  return (
    <Checkbox
      checked={selection.has(id)}
      size="small"
      onChange={() => {
        const newSelection = selection.has(id)
          ? selection.remove(id)
          : selection.add(id)
        onSelect(newSelection)
      }}
    />
  )
}
