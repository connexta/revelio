import { setIn } from 'immutable'
import React from 'react'
import { storiesOf } from '../@storybook/react'
import results from '../sample-multi-result.json'
import Gallery from './gallery'

const thumbnailResults = results.filter(
  result => result.metacard.attributes.thumbnail !== undefined
)

let genResults = []
for (let i = 0; i < 20; i++) {
  genResults = genResults.concat(
    thumbnailResults.map(result => {
      const { id } = result.metacard.attributes
      return setIn(result, ['metacard', 'attributes', 'id'], `${id}${i}`)
    })
  )
}

const stories = storiesOf('Gallery', module)
stories.addDecorator(Story => <Story />)

stories.add('basic', () => {
  return <Gallery results={genResults} />
})
