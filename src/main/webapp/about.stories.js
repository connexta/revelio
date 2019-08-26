import React from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
import About from './about'
import {
  withKnobs,
  text,
  boolean,
  number,
} from '@connexta/ace/@storybook/addon-knobs'

const stories = storiesOf('aboutRoute', module)
stories.addDecorator(withKnobs)

stories.add('someStory', () => {
  return (
    <About
      branding={text('branding', 'DDF')}
      appName={text('appName', 'Intrigue')}
      version={text('version', '2.18.0-SNAPSHOT')}
      identifier={text('identifier', 'feu7s2abm with Changes')}
      releaseDate={text('releaseDate', 'August 20th 2019')}
    />
  )
})
