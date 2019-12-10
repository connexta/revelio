import React, { useState } from 'react'
import { Results } from './results'
import { storiesOf } from '../@storybook/react'
import Skeleton from '@material-ui/lab/Skeleton'
import { boolean } from '@connexta/ace/@storybook/addon-knobs'
import tn from './story-thumb'

import genResults from '../gen-results'

const stories = storiesOf('Result', module)

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

stories.add('Basic', () => {
  const [selection, setSelected] = useState([])

  const results = genResults()

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
