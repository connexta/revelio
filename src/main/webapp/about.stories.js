import React from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { About } from './about'
import { withKnobs, text } from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'

const stories = storiesOf('About', module)
stories.addDecorator(withKnobs)

stories.add('success', () => {
  const attributes = {
    branding: text('Branding', 'DDF'),
    product: text('Product', 'Intrigue'),
    version: text('Version', '2.18.0-SNAPSHOT'),
    identifier: text('Identifier', 'feu7s2abm with Changes'),
    releaseDate: text('Release Date', 'August 20th 2019'),
  }

  return <About attributes={attributes} />
})

stories.add('loading', () => {
  return <About />
})

stories.add('failure', () => {
  const error = text('Error', 'API Failure')
  return <About error={error} onFetchProperties={action('onFetchProperties')} />
})
