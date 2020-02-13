import React from 'react'
import { storiesOf } from '../@storybook/react'
const stories = storiesOf('Sharing', module)
import Sharing from './sharing'

const storyIndividuals = {
  read: ['user1', 'user2'],
  write: ['user3', 'user4'],
  admin: ['user5', 'user6'],
}

const storyGroups = {
  read: ['group1', 'group2'],
  write: ['group3', 'group4'],
}

const storyRoles = ['role1', 'role2', 'role3']

const storySave = () => [() => {}]

stories.add('Sharing', () => {
  return (
    <Sharing
      individuals={storyIndividuals}
      groups={storyGroups}
      userRoles={storyRoles}
      save={storySave}
    />
  )
})
