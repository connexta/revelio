import { action } from '@connexta/ace/@storybook/addon-actions'
import { boolean } from '@connexta/ace/@storybook/addon-knobs'
import { Map } from 'immutable'
import React from 'react'
import { storiesOf } from '../../@storybook/react'
import useState from '../../@storybook/use-state'
import HiddenResultsSettings from './hidden-results-settings'
import NotificationSettings from './notification-settings'
import SearchSettings from './search-settings'
import SourceSelect from './source-select'
import TimeSettings from './time-settings'
import Settings from './user-settings'

const stories = storiesOf('User Settings', module)

const sampleBlackList = [
  {
    id: '08ce4b7e641149b58ad47ec665d87a40',
    title: 'Result 1',
  },
  {
    id: '1f130107e85a481d835b86cd90a80355',
    title:
      'Result 2 (Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title Long title) ',
  },
]

const HiddenResults = () => {
  const populated = boolean('Populated', true)
  const [state, setState] = React.useState(Map({}))
  React.useEffect(
    () => setState(Map(populated ? { resultBlacklist: sampleBlackList } : {})),
    [populated]
  )

  return (
    <HiddenResultsSettings
      value={state}
      onChange={newState => {
        setState(newState)
        action('onChange')(newState)
      }}
    />
  )
}

const UserSettings = () => {
  const [state, setState] = React.useState(Map({}))
  const open = boolean('Open Drawer', true)
  return (
    <Settings
      open={open}
      value={state}
      onSave={newState => {
        setState(newState)
        action('onSave')(newState)
      }}
    />
  )
}

stories.add('Notification Settings', () => {
  const [value, onChange] = useState(
    Map({ alertPersistence: true, alertExpiration: 2592000000 })
  )
  return <NotificationSettings value={value} onChange={onChange} />
})

stories.add('Search Settings', () => {
  const [value, onChange] = useState()
  return <SearchSettings value={value} onChange={onChange} />
})

stories.add('Time Settings', () => {
  const [value, onChange] = useState(
    Map({
      dateTimeFormat: {
        datetimefmt: 'DD MMM YYYY h:mm:ss.SSS a Z',
        timefmt: 'h:mm:ss a Z',
      },
      timeZone: 'Etc/UTC',
    })
  )
  return <TimeSettings value={value} onChange={onChange} />
})

stories.add('Hidden Results Settings', () => <HiddenResults />)

stories.add('Source Select', () => {
  const sources = [
    {
      isAvailable: false,
      sourceId: 'Source1',
      local: false,
    },
    {
      isAvailable: true,
      sourceId: 'ddf.distribution',
      local: true,
    },
    {
      isAvailable: true,
      sourceId: 'Source2',
      local: false,
    },
  ]
  const [value, onChange] = useState(['Source1', 'Source2'])
  return <SourceSelect value={value} onChange={onChange} sources={sources} />
})

stories.add('User Settings', () => <UserSettings />)
