import * as React from 'react'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { MetacardInteraction } from '../../metacard-interaction'

const DuplicateMetacardInteraction = props => {
  return (
    <MetacardInteraction
      Icon={FileCopyIcon}
      onClick={props.onDuplicate}
      message={`Duplicate ${props.itemName}`}
    />
  )
}

export default DuplicateMetacardInteraction
