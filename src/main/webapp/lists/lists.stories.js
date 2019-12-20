import React from 'react'
import { storiesOf } from '../@storybook/react'
import useState from '../@storybook/use-state'
import List from './lists'

const stories = storiesOf('Lists', module)
stories.addDecorator(Story => <Story />)

stories.add('List Select', () => {
  const lists = [
    {
      list_bookmarks: [
        '7aafcf53cb0b4ffca9bc26cefe9f469e',
        '91208b8337bd4d61a061849b2f6c2068',
      ],
      list_icon: 'archive',
      id: '6d305f2d62fa4b65b738346850eaa632',
      title: 'List 1',
    },
    {
      list_bookmarks: [
        '91208b8337bd4d61a061849b2f6c2068',
        'da3ffd5f0a314cbfabed2b06379e4497',
        '2681cabd1b1341979378cd61b0ab96c9',
      ],
      list_icon: 'folder',
      id: 'f19b28df40854a7696c39509e4d69e6b',
      title: 'List 2',
    },
    {
      list_bookmarks: [
        '7aafcf53cb0b4ffca9bc26cefe9f469',
        '91208b8337bd4d61a061849b2f6c206',
      ],
      list_icon: 'folder',
      id: '6d305f2d62fa4b65b738346850eaa63',
      title: 'List 3',
    },
  ]
  const [, onSelect] = useState(null)
  return <List onSelect={onSelect} lists={lists} />
})
