import React from 'react'

import { storiesOf } from '../@storybook/react'

import { withKnobs, text } from '@connexta/ace/@storybook/addon-knobs'

import { action } from '@connexta/ace/@storybook/addon-actions'

const stories = storiesOf('ConfirmDelete', module)

stories.addDecorator(withKnobs)

import ConfirmDelete from '.'

stories.add('basic usage', () => {
  const message = text('Message', 'This will permanently do a thing')

  return <ConfirmDelete onDelete={action('onDelete')}>{message}</ConfirmDelete>
})
