import React, { useState } from 'react'
import { Results } from './results'
import { storiesOf } from '../../@storybook/react'

import genResults from '../../sample-data/gen-results'

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
        />
      </div>
    </div>
  )
})
