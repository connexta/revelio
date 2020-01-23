import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import Paper from '@material-ui/core/Card'
import Thumbnail from '../thumbnail/thumbnail'
import Divider from '@material-ui/core/Divider'
import LinearProgress from '@material-ui/core/LinearProgress'
import Link from '@material-ui/core/Link'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import gql from 'graphql-tag'

import { useApolloFallback } from '../react-hooks'

const AttributeTitle = props => {
  const { title } = props

  return (
    <Typography variant="h6" component="h2">
      {title}
    </Typography>
  )
}
const AttributeValue = props => {
  const { title, value } = props
  const values = value instanceof Array ? value : [value]

  return (
    <div>
      {values.map((itemValue, index) => {
        if (title === 'thumbnail' && itemValue !== 'No Value') {
          return <ThumbnailValue key={index} value={itemValue} />
        }
        return <TextValue key={index} value={itemValue} />
      })}
    </div>
  )
}

const ThumbnailValue = props => {
  const { value } = props
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Thumbnail src={value} />
    </div>
  )
}

const TextValue = props => {
  const { value } = props
  return (
    <Typography color="textSecondary" gutterBottom>
      {value}
    </Typography>
  )
}

const AttributeEntry = props => {
  const { title, value } = props

  return (
    <div style={{ width: '100%' }}>
      <AttributeTitle title={title} />
      <AttributeValue title={title} value={value} />
    </div>
  )
}

const MultiResultPropertiesList = props => {
  const { results } = props
  const attributeSet = getAttributeSet(results)

  return Array.from(attributeSet)
    .sort()
    .map(key => {
      const values = results.map(result => {
        return result.metacard.properties[key] || 'No Value'
      })
      return (
        <div key={key}>
          <ListItem divider>
            <List style={{ width: '100%' }}>
              <AttributeEntry title={key} value={values} />
            </List>
          </ListItem>
        </div>
      )
    })
}

const PropertiesList = props => {
  const { properties } = props
  return Object.entries(properties)
    .sort()
    .map(entry => {
      const key = entry[0]
      const value = entry[1]
      return (
        <div key={key}>
          <ListItem divider>
            <AttributeEntry title={key} value={value} />
          </ListItem>
        </div>
      )
    })
}

const Details = props => {
  const { results } = props
  const result = results instanceof Array ? results[0] : results
  return (
    <Paper>
      <List>
        <PropertiesList properties={result.metacard.properties} />
      </List>
    </Paper>
  )
}

const createActionsMap = actions => {
  const mapActions = actions.filter(
    action => action.id.indexOf('catalog.data.metacard.map.') === 0
  )
  const exportActions = actions
    .filter(action => action.title.indexOf('Export') === 0)
    .filter(action => mapActions.indexOf(action) === -1)
  const otherActions = actions.filter(
    action =>
      mapActions.indexOf(action) === -1 && exportActions.indexOf(action) === -1
  )
  return { exportActions, mapActions, otherActions }
}

const ActionLinks = props => {
  const { title, actions } = props
  if (actions.length === 0) {
    return null
  }

  return (
    <div style={{ width: '100%' }}>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      {actions.map(action => {
        return (
          <ListItem key={action.id}>
            <Typography color="textSecondary" gutterBottom>
              <Link target="_blank" href={action.url}>
                {' '}
                {action.displayName || action.title || action.id}{' '}
              </Link>
            </Typography>
          </ListItem>
        )
      })}
    </div>
  )
}

const Actions = props => {
  const { results } = props
  const result = results instanceof Array ? results[0] : results
  const actions = result.actions
  if (actions && actions.length) {
    const actionsMap = createActionsMap(result.actions)
    return (
      <Paper>
        <List style={{ marginLeft: '10px' }}>
          <ActionLinks title="Export as:" actions={actionsMap.exportActions} />
          <Divider />
          <ActionLinks title="Map:" actions={actionsMap.mapActions} />
          <Divider />
          <ActionLinks title="Various:" actions={actionsMap.otherActions} />
        </List>
      </Paper>
    )
  } else {
    return (
      <Paper>
        <List style={{ marginLeft: '10px' }}>
          <Typography variant="h6" component="h2">
            No actions provided
          </Typography>
        </List>
      </Paper>
    )
  }
}

const Summary = props => {
  const { results, summaryAttributes } = props

  let summaryProperties = { '': 'No summary attributes were provided.' }
  if (summaryAttributes && summaryAttributes.length) {
    const result = results instanceof Array ? results[0] : results
    const properties = result.metacard.properties

    const filteredProperties = summaryAttributes.map(attr => {
      const property = properties[attr]
      if (property != undefined) {
        return { [attr]: property }
      } else {
        return {}
      }
    })

    summaryProperties = filteredProperties.reduce(
      (acc, property) => ({
        ...acc,
        ...property,
      }),
      {}
    )
  }

  return (
    <Paper>
      <List>
        <PropertiesList properties={summaryProperties} />
      </List>
    </Paper>
  )
}

const getAttributeSet = results => {
  return results.reduce((acc, value) => {
    const properties = value.metacard.properties
    const keys = Object.keys(properties)
    return new Set([...acc, ...keys])
  }, new Set())
}

const MultiResultDetails = props => {
  const { results } = props

  return (
    <Paper>
      <Typography variant="h6" component="h2" style={{ textAlign: 'center' }}>
        {results.length} results selected
      </Typography>
      <List>
        <MultiResultPropertiesList results={results} />
      </List>
    </Paper>
  )
}

const resultTabMap = {
  0: Summary,
  1: Details,
  2: Actions,
}

const multiResultTabMap = {
  0: MultiResultDetails,
}

const getTabComponent = results => {
  if (results instanceof Array && results.length > 1) {
    return MultiResultTabs
  }
  return ResultTabs
}

const ResultTabs = props => {
  const [tab, setTab] = React.useState(0)
  const Component = resultTabMap[tab]

  return (
    <div style={{ paddingTop: 10 }}>
      <Tabs
        value={tab}
        onChange={(_, selectedIndex) => {
          setTab(selectedIndex)
        }}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Summary" />
        <Tab label="Details" />
        <Tab label="Actions" />
      </Tabs>
      {Component ? <Component {...props} /> : null}
    </div>
  )
}

const MultiResultTabs = props => {
  const [tab, setTab] = React.useState(0)
  const Component = multiResultTabMap[tab]

  return (
    <div style={{ paddingTop: 10 }}>
      <Tabs
        value={tab}
        onChange={(_, selectedIndex) => {
          setTab(selectedIndex)
        }}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Details" />
      </Tabs>
      {Component ? <Component {...props} /> : null}
    </div>
  )
}

const defaultSummaryAttributes = ['created', 'modified', 'thumbnail']

const Inspector = props => {
  const { results, summaryAttributes = defaultSummaryAttributes } = props
  const TabComponent = getTabComponent(results)

  if (results && results.length) {
    return (
      <TabComponent results={results} summaryAttributes={summaryAttributes} />
    )
  } else {
    return <PropertiesList properties={{ '': 'No results were provided.' }} />
  }
}

const query = gql`
  query InspectorSummaryShow {
    systemProperties {
      summaryShow
    }
  }
`

const Loading = () => {
  return (
    <Paper>
      <LinearProgress />
    </Paper>
  )
}

const Container = props => {
  const { loading, error, data = {} } = useQuery(query)
  if (loading) {
    return <Loading />
  }

  const summaryAttributes = data.systemProperties.summaryShow

  return (
    <Inspector {...props} error={error} summaryAttributes={summaryAttributes} />
  )
}

export default props => {
  const Component = useApolloFallback(Container, Inspector)
  return <Component {...props} />
}

export { Actions, Details, Inspector, MultiResultDetails, Summary }
