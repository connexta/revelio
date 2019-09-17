import React, { useState } from 'react'
import { Results } from './results'
import { storiesOf } from '@connexta/ace/@storybook/react'
import Skeleton from '@material-ui/lab/Skeleton'
import { boolean } from '@connexta/ace/@storybook/addon-knobs'
import tn from './story-thumb'

const stories = storiesOf('Result', module)
stories.addDecorator(Story => <Story />)

const attributes = [
  'Title',
  'Thumbnail',
  'Description',
  'Created',
  'Modified',
  'Checksum',
  'ID',
]

const Thumbnail = () => {
  const loaded = boolean('Load Thumbnail', false)
  return loaded ? (
    <img style={{ maxHeight: 100 }} src={tn} />
  ) : (
    <Skeleton variant="rect" height="100px" width="100px" />
  )
}

const LA = {
  title: 'Los Angeles',
  description: `Painting should do one thing. It should put happiness in your heart.
  Give him a friend, we forget the trees get lonely too. Don't forget to tell these special people in your life just how special they are to you.
  If I paint something, I don't want to have to explain what it is. We're not trying to teach you a thing to copy.
  We're just here to teach you a technique, then let you loose into the world. Trees get lonely too, so we'll give him a little friend.`,
  created: 'September 4, 1781',
  modified: 'April 29, 1992',
  checksum: '1',
}

let results = []

results.push({
  ...LA,
  id: '-1',
  description: 'A very large, very crowded city.',
})

for (let i = 0; i < 100; i++) {
  results.push({
    ...LA,
    id: i.toString(),
  })
}

stories.add('Basic', () => {
  const [selection, setSelected] = useState([])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          height: '90vh',
          width: '90vw',
          border: '1px dashed orange',
        }}
      >
        <Results
          results={results}
          attributes={attributes}
          selection={selection}
          onSelect={setSelected}
          Thumbnail={Thumbnail}
        />
      </div>
    </div>
  )
})
