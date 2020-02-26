import React from 'react'

import { storiesOf } from '../../@storybook/react'

import { number } from '@connexta/ace/@storybook/addon-knobs'

import { action } from '@connexta/ace/@storybook/addon-actions'

const stories = storiesOf('IndexCards', module)

import {
  IndexCards,
  AddCardItem,
  IndexCardItem,
  DeleteAction,
  ShareAction,
  DuplicateAction,
  Actions,
} from '.'

const createItem = n => {
  return {
    id: n,
    title: `Item: #${n}`,
    metacard_owner: 'admin@localhost.local',
    metacard_modified: new Date(),
  }
}

const generateItems = n => {
  const items = []
  for (let i = 0; i < n; i++) {
    items.push(createItem(i))
  }
  return items
}

stories.add('basic usage', () => {
  const n = number('Number of Items', 10)
  const items = generateItems(n)

  return (
    <IndexCards>
      <AddCardItem onClick={action('onCreate')} />
      {items.map(item => {
        return (
          <IndexCardItem key={item.id} {...item}>
            <Actions>
              <ShareAction onShare={action('onShare')} />
              <DeleteAction onDelete={action('onDelete')} />
              <DuplicateAction onDuplicate={action('onDuplicate')} />
            </Actions>
          </IndexCardItem>
        )
      })}
    </IndexCards>
  )
})
