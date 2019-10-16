import React from 'react'

import { storiesOf } from '@connexta/ace/@storybook/react'
import { action } from '@connexta/ace/@storybook/addon-actions'

import ReactLayout from './react-layout'

const stories = storiesOf('ReactLayout', module)

stories.add('basic', () => {
  const Test = () => 'Hi'

  const config = {
    content: [
      {
        type: 'row',
        content: [
          {
            type: 'component',
            title: 'A',
            componentName: 'test-component',
          },
          {
            type: 'column',
            content: [
              {
                type: 'component',
                title: 'B',
                componentName: 'test-component',
              },
              {
                type: 'component',
                title: 'C',
                componentName: 'test-component',
              },
            ],
          },
        ],
      },
    ],
  }

  const components = {
    'test-component': Test,
  }

  return (
    <div style={{ height: 'calc(100vh - 16px)', width: 'calc(100vw - 16px)' }}>
      <ReactLayout
        config={config}
        components={components}
        onChange={action('onChange')}
      />
    </div>
  )
})
