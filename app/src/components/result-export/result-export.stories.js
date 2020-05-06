import React from 'react'
import { storiesOf } from '../../@storybook/react'
import ResultExport from './result-export'

const stories = storiesOf('Export', module)

const exportFormats = [
  { id: '1', displayName: 'format 1' },
  { id: '2', displayName: 'format 2' },
  { id: '3', displayName: 'format 3' },
  { id: '4', displayName: 'format 4' },
]

stories.add('Export', () => {
  return (
    <ResultExport
      exportFormats={exportFormats}
      handleClose={() => {}}
      exportResult={() => {}}
      saveFile={() => {}}
    />
  )
})
