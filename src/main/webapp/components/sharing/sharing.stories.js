import React from 'react'
import { storiesOf } from '../../@storybook/react'
const stories = storiesOf('Sharing', module)
import Sharing from './sharing'

const storyIndividuals = {
  security_access_individuals_read: ['user1', 'user2'],
  security_access_individuals: ['user3', 'user4'],
  security_access_administrators: ['user5', 'user6'],
}

const storyGroups = {
  security_access_groups_read: ['group1', 'group2'],
  security_access_groups: ['group3', 'group4'],
}

const storyRoles = ['group1', 'group2', 'group3', 'group4']

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
