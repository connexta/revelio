import React, { memo, useState } from 'react'

import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'

import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
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
import { BasicSearch } from '../basic-search'
import QuerySelector from './query-selector'

import loadable from '@connexta/ace/react-loadable'
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

const Loading = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LinearProgress style={{ width: '25vw', height: 10 }} />
    </div>
  )
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
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>Error</div>
  }

  const attributes = data.metacardsById[0].attributes[0]

  const { title, queries, lists } = attributes

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

        {tab === 0 && (
          <React.Fragment>
            {query !== null ? (
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    style={{ marginBottom: 20 }}
                    label="Query Title"
                    value={query.title || ''}
                    fullWidth
                  />
                  <IconButton onClick={() => setQuery(null)}>
                    <CloseIcon />
                  </IconButton>
                </div>
                <div style={{ overflow: 'hidden', padding: 2 }}>
                  <BasicSearch
                    query={query}
                    onSearch={query => {
                      // setPageIndex(0)
                      setQuery(query)
                      onClear()
                      onSearch(query)
                    }}
                  />
                </div>
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
              </div>
            ) : (
              <QuerySelector
                queries={queries}
                onSelect={query => {
                  onClear()
                  setQuery(query)
                }}
              />
            )}
          </React.Fragment>
        )}

        {tab === 1 && (
          <Lists
            lists={lists}
            onSelect={data => {
              const results = data.metacardsById.reduce((acc, metacard) => {
                return acc.concat(metacard.results)
              }, [])
              setListResults(results)
            }}
          />
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
    return <Loading />
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
