import React from 'react'
import Thumbnail from './thumbnail'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { withKnobs, select } from '@connexta/ace/@storybook/addon-knobs'

const stories = storiesOf('Thumbnail', module)

stories.addDecorator(Story => <Story />)
stories.addDecorator(withKnobs)

stories.add('Error', () => {
  return (
    <div
      style={{
        width: 'calc(100vw - 16px)',
        height: 'calc(100vh - 16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Thumbnail src={'oof'} />
    </div>
  )
})

stories.add('Success', () => {
  const image = select(
    'Image Type',
    {
      Square: 'https://connexta.com/images/work1.jpg',
      Long: 'https://connexta.com/images/logo-ddf2.png',
    },
    'Square'
  )
  return (
    <div
      style={{
        width: 'calc(100vw - 16px)',
        height: 'calc(100vh - 16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Thumbnail src={image} />
    </div>
  )
})
