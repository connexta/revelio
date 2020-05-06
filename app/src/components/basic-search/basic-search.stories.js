import React from 'react'
import { storiesOf } from '../../@storybook/react'
import { action } from '@storybook/addon-actions'
import BasicSearch from './basic-search'

const stories = storiesOf('BasicSearch', module)

stories.add('basic', () => {
  return <BasicSearch onSearch={action('onSearch')} />
})
