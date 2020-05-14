import { storiesOf } from '../../@storybook/react'
import { number } from '@storybook/addon-knobs'
import React from 'react'
import SpacedLinearContainer from './spaced-linear-container'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'

const stories = storiesOf('SpacedLinearContainer', module)
stories.addDecorator(Story => <Story />)

stories.add('column direction', () => {
  const spacing = number('spacing', 1)
  return (
    <SpacedLinearContainer
      style={{ border: '1px solid blue' }}
      direction="column"
      spacing={spacing}
    >
      <Button variant="contained">A Button</Button>
      <Box>Some Text</Box>
      <TextField variant="outlined" label="A Text Field" />
    </SpacedLinearContainer>
  )
})

stories.add('row direction', () => {
  const spacing = number('spacing', 1)
  return (
    <SpacedLinearContainer
      style={{ border: '1px solid blue' }}
      direction="row"
      spacing={spacing}
    >
      <Button variant="contained">A Button</Button>
      <Box>Some Text</Box>
      <TextField variant="outlined" label="A Text Field" />
    </SpacedLinearContainer>
  )
})
