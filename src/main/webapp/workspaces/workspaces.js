import React, { memo, useState } from 'react'

import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'

import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import {
  IndexCards,
  IndexCardItem,
  DeleteAction,
  ShareAction,
  Actions,
} from '../index-cards'

import { Link, useParams } from 'react-router-dom'

import { useQueryExecutor } from '../react-hooks'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import QueryStatus from '../query-status'
import { BasicSearch, populateDefaultQuery } from '../basic-search'
import { toFilterTree, fromFilterTree } from '../basic-search-helper'
import QuerySelector from './query-selector'

import loadable from 'react-loadable'
import Lists from '../lists'

const LoadingComponent = () => <LinearProgress />
let MemoizedVisualizations = () => null
if (typeof window !== 'undefined') {
  MemoizedVisualizations = loadable({
    loader: () =>
      import(/* webpackChunkName: "visualizations" */ './visualizations').then(
        module => memo(module.default)
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
          cql
          filterTree
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

export const Workspace = () => {
  const { id } = useParams()

  const [listResults, setListResults] = React.useState([])
  const [query, setQuery] = useState(null)
  const { results, status, onSearch, onCancel, onClear } = useQueryExecutor()

  const [tab, setTab] = React.useState(0)

  const { loading, error, data } = useQuery(workspaceById, {
    variables: { ids: [id] },
    onCompleted: data => {
      setQuery(data.metacardsById[0].attributes[0].queries[0])
    },
  })

  if (loading) {
    return <LoadingComponent />
  }

  if (error) {
    return <div>Error</div>
  }

  const QueryEditor = props => (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          style={{ marginBottom: 20 }}
          label="Query Title"
          value={props.query.title || ''}
          fullWidth
        />
      </div>
      <div style={{ overflow: 'hidden', padding: 2 }}>
        <BasicSearch
          query={props.query}
          onSearch={query => {
            if (typeof props.onSearch === 'function') {
              props.onSearch(query)
            }
            // setPageIndex(0)
            setQuery(query)
            onClear()
            onSearch(query)
          }}
        />
      </div>
    </div>
  )

  const attributes = data.metacardsById[0].attributes[0]

  const { title, queries, lists } = attributes
  const hasQueries = queries && queries.length > 0

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
          hasQueries && (
            <React.Fragment>
              {/* //TODO mutate cache on search so that the queries reflect edits made in queryEditor */}
              <QuerySelector
                QueryEditor={QueryEditor}
                queries={queries}
                currentQuery={query}
                onSelect={query => {
                  onClear()
                  setQuery(query)
                  onSearch(
                    //toFilterTree / fromFilterTree are needed because queries that have a location filter
                    //do not have the correct structure to be processed with cql
                    populateDefaultQuery(
                      toFilterTree(fromFilterTree(query.filterTree))
                    )
                  )
                }}
              />

              <QueryStatus
                sources={status}
                onRun={srcs => {
                  //setPageIndex(0)
                  onSearch({ ...query, srcs })
                }}
                onCancel={srcs => {
                  srcs.forEach(src => {
                    onCancel(src)
                  })
                }}
              />
              {/* //TODO add paging */}
              {results.map(({ metacard }) => (
                <IndexCardItem
                  key={metacard.properties.id}
                  title={metacard.properties.title}
                  subHeader={' '}
                />
              ))}
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
                key={metacard.properties.id}
                title={metacard.properties.title}
                subHeader={' '}
              />
            ))}
          </React.Fragment>
        )}
      </div>
      <div style={{ flex: '1' }}>
        <MemoizedVisualizations results={tab === 0 ? results : listResults} />
      </div>
    </div>
  )
}

const workspaces = gql`
  query Workspaces {
    metacardsByTag(tag: "workspace") {
      attributes {
        id
        title
        owner: metacard_owner
        modified: metacard_modified
      }
    }
  }
`

export default () => {
  const { loading, error, data } = useQuery(workspaces)

  if (loading) {
    return <LoadingComponent />
  }

  if (error) {
    return <div>Error</div>
  }

  const attributes = data.metacardsByTag.attributes

  return (
    <IndexCards>
      {attributes.map(attrs => {
        return (
          <Link
            key={attrs.id}
            to={`/workspaces/${attrs.id}`}
            style={{ textDecoration: 'none' }}
          >
            <IndexCardItem {...attrs}>
              <Actions>
                <ShareAction />
                <DeleteAction />
              </Actions>
            </IndexCardItem>
          </Link>
        )
      })}
    </IndexCards>
  )
}
