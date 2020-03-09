import React from 'react'
import Typography from '@material-ui/core/Typography'
import { CustomTooltip } from '../tooltip'
import ErrorIcon from '@material-ui/icons/Error'
import IconButton from '@material-ui/core/IconButton'

export const ReadOnly = props => {
  const { isReadOnly, indexCardType } = props
  const readOnlyMessage =
    'This ' +
    indexCardType +
    ' is Read Only. This means you cannot change, delete or share this ' +
    indexCardType +
    '. Please duplicate this ' +
    indexCardType +
    ' or ask the owner for permissions to make changes.'
  return isReadOnly ? (
    <CustomTooltip
      title={
        <React.Fragment>
          <Typography component={'span'} color="inherit">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <ErrorIcon
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: '.1rem',
                }}
              />{' '}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '.3rem',
                }}
              >
                {readOnlyMessage}
              </div>
            </div>
          </Typography>
        </React.Fragment>
      }
    >
      <div
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        Read Only
      </div>
    </CustomTooltip>
  ) : null
}
