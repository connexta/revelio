import * as React from 'react'
import EditIcon from '@material-ui/icons/Edit'
import { MetacardInteraction } from '../../metacard-interaction'
type EditMetacardInteractionsProps = {
  onEdit: (e: React.SyntheticEvent) => void
  itemName: string
}

const EditMetacardInteractions = (props: EditMetacardInteractionsProps) => {
  const { onEdit, itemName } = props
  return (
    <MetacardInteraction
      Icon={EditIcon}
      onClick={onEdit}
      message={`Edit ${itemName}`}
    />
  )
}

export default EditMetacardInteractions
