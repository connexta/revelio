import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Card'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'

const Info = ({ title, value }) => {
  let count = 1
  if (value instanceof Array) {
    count = value.length
  }
  let countLabel = ''
  if (count > 1) {
    countLabel = ` (${count} values)`
  }

  const values = value instanceof Array ? value : [value]

  return (
    <div>
      <Typography variant="h6" component="h2">
        {title}
        {countLabel}
      </Typography>
      {values.map(itemValue => {
        return (
          <Typography color="textSecondary" gutterBottom>
            {itemValue}
          </Typography>
        )
      })}
    </div>
  )
}

const MultiResultInfo = ({ title, values }) => {
  return (
    <div style={{ width: '100%' }}>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      {values.map((itemValue, index, array) => {
        if (index < array.length - 1) {
          return (
            <ListItem divider>
              <Info title="" value={itemValue} />
            </ListItem>
          )
        } else {
          return (
            <ListItem>
              <Info title="" value={itemValue} />
            </ListItem>
          )
        }
      })}
    </div>
  )
}

const MultiResultPropertiesList = props => {
  const { properties } = props
  return Object.entries(properties)
    .sort()
    .map(entry => {
      const key = entry[0]
      const values = entry[1]
      return (
        <div>
          <ListItem key={key} divider>
            <MultiResultInfo title={key} values={values} />
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
        <div>
          <ListItem key={key} divider>
            <Info title={key} value={value} />
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

const Summary = props => {
  const { results, summaryAttributes } = props

  let summaryProperties = { Warning: 'No summary attributes were provided.' }
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

const getAttributeMap = results => {
  const attributeMap = {}

  results.map((result, index) => {
    const properties = result.metacard.properties
    const keys = Object.keys(properties)
    keys.forEach(key => {
      if (index > 0) {
        attributeMap[key][index] = properties[key]
      } else {
        attributeMap[key] = [properties[key]]
      }
    })
  })

  return attributeMap
}

const MultiResultDetails = props => {
  const { results } = props
  const attributeMap = getAttributeMap(results)
  return (
    <Paper>
      <List>
        <MultiResultPropertiesList properties={attributeMap} />
      </List>
    </Paper>
  )
}

const resultTabMap = {
  0: Summary,
  1: Details,
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

export const Inspector = props => {
  const [tab, setTab] = React.useState(0)
  const { results, summaryAttributes } = props

  const TabComponent = getTabComponent(results)

  return (
    <TabComponent results={results} summaryAttributes={summaryAttributes} />
  )
}

const query = gql`
  query {
    systemProperties {
      summaryShow
    }
  }
`

export default () => {
  const { loading, error, data = {} } = useQuery(query)
  const summaryAttributes = data.systemProperties.summaryShow
  const props = { error, summaryAttributes }

  return <Inspector {...props} />
}
