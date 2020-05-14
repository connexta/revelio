import { boolean, text } from '@storybook/addon-knobs'
import React from 'react'
import { storiesOf } from '../../@storybook/react'
import User from './user'

const stories = storiesOf('User', module)

const Component = props => {
  const open = boolean('Open Drawer', true)

  return <User open={open} value={props.value} />
}
stories.add('basic', () => {
  const value = {
    username: text('Username', 'admin'),
    email: text('Email', 'admin@localhost.local'),
    isGuest: boolean('Is Guest', false),
  }
  return <Component value={value} />
})
