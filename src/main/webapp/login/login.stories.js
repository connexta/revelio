import React from 'react'
import { storiesOf } from '../@storybook/react'
const stories = storiesOf('LogIn', module)
import { LogIn } from './login'

stories.add('login modal', () => {
  return <LogIn label="Login" />
})
