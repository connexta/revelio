import React from 'react'
import { IndexCardItem, Actions } from '../index-cards'
import AddIcon from '@material-ui/icons/Add'
import GetAppIcon from '@material-ui/icons/GetApp'
import IconButton from '@material-ui/core/IconButton'

export default props => {
  const { results, handleOpen, setResult } = props
  return React.useMemo(
    () =>
      results.map(({ metacard }) => (
        <IndexCardItem
          key={metacard.attributes.id}
          title={metacard.attributes.title}
          subHeader={' '}
          titleTypographyProps={{
            variant: 'body1',
          }}
        >
          <Actions disableSpacing={true}>
            <IconButton
              onClick={e => {
                setResult(metacard.attributes.id)
                handleOpen(e)
              }}
              size="small"
            >
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                window.open(
                  metacard.attributes['resource-download-url'],
                  '_blank'
                )
              }}
              size="small"
            >
              <GetAppIcon />
            </IconButton>
            {props.actions ? props.actions : null}
          </Actions>
        </IndexCardItem>
      )),
    [results]
  )
}
