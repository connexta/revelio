import * as React from 'react'
import { Box } from '@material-ui/core'
import Fab from '@material-ui/core/Fab'
import { Remove } from '@material-ui/icons'
import { MetacardType } from './dummyDefinitions'
import { makeDefaultSearchGeo } from './search-geo-factory'

export const withRemoveButton = (Component: any) => {
  return (props: any) => {
    return typeof props.onRemove === 'function' ? (
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <Box style={{ margin: 10 }}>
          <Fab onClick={() => props.onRemove()} size="small" color="secondary">
            <Remove />
          </Fab>
        </Box>
        <Component {...props} />
      </Box>
    ) : (
      <Component {...props} />
    )
  }
}

export const withDivider = (Component: any) => {
  return (props: any) => (
    <Box style={{ display: 'flex' }}>
      <Box>
        <Divider />
      </Box>
      <Component {...props} />
    </Box>
  )
}

const Divider = () => (
  <Box
    style={{
      height: '100%',
      width: 12,
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      float: 'left',
      borderRadius: '14px',
      marginRight: 10,
    }}
  />
)

export const defaultFilter = {
  property: 'anyText',
  type: 'ILIKE',
  value: '',
}

export const filterHeaderButtonStyle = {
  height: 'fit-content',
  margin: 'auto',
  marginLeft: 0,
  marginRight: 10,
}

export const filterComponentStyle = {
  margin: 5,
}

export const getDefaultValue = (type: MetacardType | undefined) => {
  switch (type) {
    case 'LOCATION':
      return makeDefaultSearchGeo()
    case 'DATE':
      return ''
    case 'BOOLEAN':
      return false
    case 'STRING':
      return ''
    case 'INTEGER':
    case 'SHORT':
    case 'LONG':
      return '0'
    case 'FLOAT':
    case 'DOUBLE':
      return '0.0'
    default:
      return ''
  }
}
