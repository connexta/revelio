import React, { useState } from 'react'
import { Results } from './results'
import { storiesOf } from '../../@storybook/react'

import { object } from '@storybook/addon-knobs'

import genResults from '../../sample-data/gen-results'

const stories = storiesOf('Result', module)

const attributes = [
  'title',
  'thumbnail',
  'description',
  'created',
  'modified',
  'checksum',
  'id',
]

const attributeAliases = {
  title: 'aliased-title',
  'made-up-attribute': 'still-fake',
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
          attributeAliases={object('Attribute Aliases', attributeAliases)}
        />
      </div>
    </div>
  )
})
