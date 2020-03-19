import { useQuery } from '@apollo/react-hooks'
import Divider from '@material-ui/core/Divider'
import LinearProgress from '@material-ui/core/LinearProgress'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import loadable from 'react-loadable'
import { useParams } from 'react-router-dom'
import { useQueryExecutor } from '../../react-hooks'
import { IndexCardItem } from '../index-cards'
import Lists from '../lists'
import { InlineRetry } from '../network-retry'
import QueryEditor from '../query-editor'
import QueryManager from '../query-manager'
import QueryStatus from '../query-status'

const LoadingComponent = () => <LinearProgress />

let Visualizations = () => null
if (typeof window !== 'undefined') {
  Visualizations = loadable({
    loader: async () =>
      await import(/* webpackChunkName: "visualizations" */ '../visualizations').then(
        module => module.default
      ),
    loading: LoadingComponent,
  })
}

const workspaceById = gql`
  query WorkspaceById($ids: [ID]!) {
    metacardsById(ids: $ids) {
      attributes {
        id
        title
        queries {
          id
          title
          filterTree
          type
        }
        lists {
          list_bookmarks
          list_icon
          id
          title
        }
      }
    }
  }
`

//TODO add paging
const Results = ({ results }) =>
  React.useMemo(
    () =>
      results.map(({ metacard }) => (
        <IndexCardItem
          key={metacard.attributes.id}
          title={metacard.attributes.title}
          subHeader={' '}
        />
      )),
    [results]
  )

export default () => {
  const { id } = useParams()

  const [listResults, setListResults] = React.useState([])
  const [currentQuery, setCurrentQuery] = useState(null)
  const [queries, setQueries] = useState()
  const { results, status, onSearch, onCancel, onClear } = useQueryExecutor()

  const [tab, setTab] = React.useState(0)

  const { loading, error, data } = useQuery(workspaceById, {
    variables: { ids: [id] },
    onCompleted: data => {
      const queries = data.metacardsById[0].attributes[0].queries
      setQueries(
        queries.map(query => {
          const { __typename, ...rest } = query // eslint-disable-line no-unused-vars
          return rest
        })
      )
      setCurrentQuery(queries[0] ? queries[0].id : null)
    },
  })

  if (loading) {
    return <LoadingComponent />
  }

  if (error) {
    return <InlineRetry error={error}>Error Retrieving Workspace</InlineRetry>
  }

  const attributes = data.metacardsById[0].attributes[0]

  const { title, lists } = attributes

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          width: 400,
          height: '100%',
          overflow: 'auto',
        }}
      >
        <Typography variant="h4" component="h1" style={{ padding: 20 }}>
          {title}
        </Typography>
        <Divider />

        <Tabs
          value={tab}
          onChange={(_, selectedIndex) => setTab(selectedIndex)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Search" />
          <Tab label="Lists" />
        </Tabs>

        {tab === 0 &&
          queries && (
            <React.Fragment>
              {/* //TODO mutate cache on search so that the queries reflect edits made in queryEditor */}
              <QueryManager
                QueryEditor={QueryEditor}
                queries={queries}
                currentQuery={currentQuery}
                onSearch={query => {
                  onClear()
                  setCurrentQuery(query.id)
                  onSearch(query)
                }}
                onChange={queries => setQueries(queries)}
              />

              <QueryStatus
                sources={status}
                onRun={srcs => {
                  //setPageIndex(0)
                  onSearch({
                    ...queries.find(query => (query.id = currentQuery)),
                    srcs,
                  })
                }}
                onCancel={srcs => {
                  srcs.forEach(src => {
                    onCancel(src)
                  })
                }}
              />
              <Results results={results} />
            </React.Fragment>
          )}

        {tab === 1 && (
          <React.Fragment>
            <Lists
              lists={lists}
              onSelect={data => {
                const results = data.metacardsById.reduce((acc, metacard) => {
                  return acc.concat(metacard.results)
                }, [])
                setListResults(results)
              }}
            />

            {listResults.map(({ metacard }) => (
              <IndexCardItem
                key={metacard.attributes.id}
                title={metacard.attributes.title}
                subHeader={' '}
              />
            ))}
          </React.Fragment>
        )}
      </div>
      <div style={{ flex: '1' }}>
        <Visualizations results={tab === 0 ? results : listResults} />
      </div>
    </div>
  )
}
