import React from 'react'

import { storiesOf } from '../../@storybook/react'

import { text } from '@storybook/addon-knobs'

import { action } from '@storybook/addon-actions'

const stories = storiesOf('ConfirmDelete', module)

import { ConfirmDeleteAction } from '.'

stories.add('basic usage', () => {
  const itemName = text('Item Name', 'thing')

  return (
    <ConfirmDeleteAction itemName={itemName} onDelete={action('onDelete')} />
  )
})
