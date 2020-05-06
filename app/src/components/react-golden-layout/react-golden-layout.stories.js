import React from 'react'

import { storiesOf } from '../../@storybook/react'
import { action } from '@storybook/addon-actions'

import { Provider, Layout } from './react-golden-layout'

const stories = storiesOf('ReactGoldenLayout', module)

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
    <Provider>
      <div
        style={{ height: 'calc(100vh - 16px)', width: 'calc(100vw - 16px)' }}
      >
        <Layout
          config={config}
          components={components}
          onChange={action('onChange')}
        />
      </div>
    </Provider>
  )
})
