import { action } from '@connexta/ace/@storybook/addon-actions'
import { boolean } from '@connexta/ace/@storybook/addon-knobs'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { Map } from 'immutable'
import React from 'react'
import HiddenResultsSettings from './hidden-results-settings'
import NotificationSettings from './notification-settings'
import SearchSettings from './search-setttings'
import TimeSettings from './time-settings'
import Settings from './user-settings'

const stories = storiesOf('User Settings', module)
stories.addDecorator(Story => <Story />)

const userPrefs = Map({
  alertPersistence: true,
  alertExpiration: 2592000000,
  resultCount: 50,
  dateTimeFormat: {
    datetimefmt: 'DD MMM YYYY h:mm:ss.SSS a Z',
    timefmt: 'h:mm:ss a Z',
  },
  timeZone: 'Etc/UTC',
})

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

const Setting = component => {
  const [state, setState] = React.useState(userPrefs)
  const Component = component ? component : null
  return (
    Component && (
      <Component
        value={state}
        onChange={newState => {
          setState(newState)
          action('onChange')(newState)
        }}
      />
    )
  )
}

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
  const populated = boolean('Populated', false)
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

const generateStory = (label, component) => ({ label, component })
const generatedStories = [
  generateStory('Notification Settings', () => Setting(NotificationSettings)),
  generateStory('Search Settings', () => Setting(SearchSettings)),
  generateStory('Time Settings', () => Setting(TimeSettings)),
  generateStory('Hidden Results Settings', HiddenResults),
  generateStory('User Settings', UserSettings),
]

generatedStories.forEach(setting => {
  stories.add(setting.label, () => {
    const Component = setting.component ? setting.component : null
    return Component && <Component />
  })
})
