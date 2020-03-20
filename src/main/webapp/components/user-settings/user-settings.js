import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward'
import BackArrowIcon from '@material-ui/icons/ArrowBackIos'
import BrushIcon from '@material-ui/icons/Brush'
import NotificationsIcon from '@material-ui/icons/Notifications'
import PublicIcon from '@material-ui/icons/Public'
import ScheduleIcon from '@material-ui/icons/Schedule'
import SearchIcon from '@material-ui/icons/Search'
import SettingsIcon from '@material-ui/icons/Settings'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { fromJS } from 'immutable'
import React from 'react'
import { useApolloFallback, useUserPrefs } from '../../react-hooks'
import { mergeDeepOverwriteLists } from '../../utils'
import HiddenResultsSettings from './hidden-results-settings'
import NotificationSettings from './notification-settings'
import SearchSettings from './search-settings'
import TimeSettings from './time-settings'
import ThemeSettings from './theme-settings'
import LinearProgress from '@material-ui/core/LinearProgress'
import InlineRetry from '../network-retry/inline-retry'

const generateSetting = (title, Icon = AccessibleForwardIcon, component) => {
  return {
    title,
    Icon,
    component:
      component ||
      (() => {
        return <h2>{title}</h2>
      }),
  }
}

const settings = [
  generateSetting('Theme', BrushIcon, ThemeSettings),
  generateSetting('Notifications', NotificationsIcon, NotificationSettings),
  generateSetting('Map', PublicIcon),
  generateSetting('Search Options', SearchIcon, SearchSettings),
  generateSetting('Time', ScheduleIcon, TimeSettings),
  generateSetting('Hidden', VisibilityOffIcon, HiddenResultsSettings),
]

const AllSettings = props => (
  <List>
    {settings.map((setting, index) => {
      const { title, Icon } = setting
      return (
        <MenuItem key={index} onClick={() => props.onClick(setting)}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText>{title}</ListItemText>
        </MenuItem>
      )
    })}
  </List>
)

const DrawerContent = props => {
  if (props.children) {
    return (
      <div
        style={{
          padding: 20,
        }}
      >
        {props.children}
      </div>
    )
  }

  return <AllSettings onClick={props.onSelect} />
}

const BackButton = props => (
  <MenuItem onClick={props.onClick} style={{ textAlign: 'left' }}>
    <ListItemIcon>
      <BackArrowIcon />
    </ListItemIcon>
    <ListItemText>
      <Typography variant="h6">Back to Settings</Typography>
    </ListItemText>
  </MenuItem>
)

const Navigation = props => {
  const Top = () =>
    props.navigate ? (
      <BackButton {...props} />
    ) : (
      <Typography style={{ marginLeft: 20 }} variant="h6">
        {`Settings`}
      </Typography>
    )

  return (
    <React.Fragment>
      <Top />
      <Divider style={{ marginTop: 10, marginBottom: 15 }} />

      {props.children}
    </React.Fragment>
  )
}

const UserSettingsDrawer = props => {
  const { open, onClose, navigate, onNavigate } = props
  return (
    <Drawer
      ModalProps={{ disableEnforceFocus: true }}
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <div style={{ width: 360, marginTop: 20 }}>
        <Navigation navigate={navigate} onClick={onNavigate}>
          {props.children}
        </Navigation>
      </div>
    </Drawer>
  )
}

const UserSettings = props => {
  const [open, setOpen] = React.useState(props.open)
  const [selected, setSelected] = React.useState({})
  const [preferences, setPreferences] = React.useState(props.value)
  if (props.loading) {
    return <LinearProgress />
  }
  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const onSave = preferences => {
    props.onSave(preferences.toJSON())
  }

  const handleDrawerClose = () => {
    setOpen(false)
    setSelected({})
    onSave(preferences)
  }

  const Component = selected.component ? selected.component : null
  const drawerProps = {
    open,
    onClose: handleDrawerClose,
    navigate: selected.component !== undefined,
    onNavigate: () => setSelected({}),
  }
  return (
    <React.Fragment>
      <IconButton edge="end" color="inherit" onClick={handleDrawerOpen}>
        <SettingsIcon />
      </IconButton>
      <UserSettingsDrawer {...drawerProps}>
        <DrawerContent
          onSelect={selected => {
            setSelected(selected)
          }}
        >
          {props.error ? (
            <InlineRetry onRetry={props.refetch}>
              Error Retrieving User Preferences
            </InlineRetry>
          ) : (
            Component && (
              <Component
                value={preferences}
                onChange={newPreferences => {
                  setPreferences(newPreferences)
                }}
                onSave={onSave}
                systemProperties={props.systemProperties}
              />
            )
          )}
        </DrawerContent>
      </UserSettingsDrawer>
    </React.Fragment>
  )
}

const Container = () => {
  const [
    userPreferences,
    updateUserPreferences,
    { error, data, loading, refetch },
  ] = useUserPrefs()
  return (
    <UserSettings
      error={error}
      loading={loading}
      refetch={refetch}
      value={userPreferences}
      onSave={userPreferences => {
        //preserve __typename fields
        const newPreferences = mergeDeepOverwriteLists(
          fromJS(data.user.preferences),
          fromJS(userPreferences)
        )

        if (!fromJS(data.user.preferences).equals(newPreferences)) {
          const userPreferences = newPreferences.toJS()
          updateUserPreferences(userPreferences)
        }
      }}
    />
  )
}

export default props => {
  const Component = useApolloFallback(Container, UserSettings)
  return <Component {...props} />
}
