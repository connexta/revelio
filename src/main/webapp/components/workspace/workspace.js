import { useQuery } from '@apollo/react-hooks'
import Divider from '@material-ui/core/Divider'
import LinearProgress from '@material-ui/core/LinearProgress'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import loadable from 'react-loadable'
import { useParams } from 'react-router-dom'
import { WorkspaceContext } from './workspace-context'
import { useQueryExecutor } from '../../react-hooks'
import { IndexCardItem } from '../index-cards'
import Lists from '../lists'
import { InlineRetry } from '../network-retry'
import QueryEditor from '../query-editor'
import QueryManager from '../query-manager'
import QueryStatus from '../query-status'
import { ResultIndexCards } from '../results'
import {
  useCreateQuery,
  useDeleteQuery,
  useSaveQuery,
  useSaveWorkspace,
} from './hooks'
import WorkspaceTitle from './workspace-title'
import { get } from 'immutable'

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
        security_access_individuals_read
        security_access_individuals
        security_access_administrators
        security_access_groups_read
        security_access_groups
        id
        title
        queries {
          id
          title
          filterTree
          type
          sorts
          sources
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

const queryToSearch = query => {
  const { sources, sorts, detail_level, filterTree } = query
  return {
    filterTree,
    sourceIds: sources,
    sortPolicy: (sorts || []).map(sort => {
      //query builder might have sorts in the correct format already
      if (typeof sort !== 'string') {
        return sort
      }
      const splitIndex = sort.lastIndexOf(',')
      return {
        propertyName: sort.substring(0, splitIndex),
        sortOrder: sort.substring(splitIndex + 1, sort.length),
      }
    }),
    detail_level: detail_level === 'All Fields' ? undefined : detail_level,
  }
}

export default () => {
  const { id } = useParams()
  const [listResults, setListResults] = React.useState([])
  const [currentQuery, setCurrentQuery] = useState(null)
  const [lists, setLists] = React.useState(null)
  const [queries, setQueries] = useState()

  const { results, status, onSearch, onCancel, onClear } = useQueryExecutor()

  const deleteQuery = useDeleteQuery(id => {
    const updatedQueries = queries.filter(query => query.id !== id)
    setQueries(updatedQueries)
    if (currentQuery === id) {
      onClear()
      setCurrentQuery(get(updatedQueries[0], 'id', null))
    }

    saveWorkspace({ queries: updatedQueries })
  })

  const saveQuery = useSaveQuery()
  const [saveWorkspace, saving] = useSaveWorkspace()

  const createQuery = useCreateQuery(query => {
    onClear()
    setQueries([query, ...queries])
    setCurrentQuery(query.id)
    saveWorkspace({ queries: [query, ...queries] })
    onSearch(queryToSearch(query))
  })

  //eslint-disable-next-line no-unused-vars
  const saveListsToWorkspace = lists => {
    // TO-DO Implement save functionality
    // saveWorkspace({ lists })
  }

  const [tab, setTab] = React.useState(0)

  const { loading, error, data } = useQuery(workspaceById, {
    variables: { ids: [id] },
    onCompleted: data => {
      const queries = data.metacardsById[0].attributes[0].queries || []
      const lists = data.metacardsById[0].attributes[0].lists
      lists &&
        setLists(
          lists.map(list => {
            const { __typename, ...rest } = list // eslint-disable-line no-unused-vars
            return rest
          })
        )
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
  const { title } = attributes

  return (
    <WorkspaceContext.Provider value={attributes}>
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
          <WorkspaceTitle
            saving={saving}
            saveWorkspace={saveWorkspace}
            title={title}
          />
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
                <QueryManager
                  QueryEditor={QueryEditor}
                  queries={queries}
                  currentQuery={currentQuery}
                  onSearch={id => {
                    onClear()
                    setCurrentQuery(id)
                    onSearch(
                      queryToSearch(queries.find(query => query.id === id))
                    )
                  }}
                  onCreate={createQuery}
                  onDelete={deleteQuery}
                  onSave={id => {
                    saveQuery(queries.find(query => query.id === id))
                  }}
                  onChange={queries => setQueries(queries)}
                />

                <QueryStatus
                  sources={status}
                  onRun={sources => {
                    //setPageIndex(0)
                    onSearch(
                      queryToSearch({
                        ...queries.find(query => query.id === currentQuery),
                        sources,
                      })
                    )
                  }}
                  onCancel={srcs => {
                    srcs.forEach(src => {
                      onCancel(src)
                    })
                  }}
                />
                <ResultIndexCards
                  results={results}
                  setLists={setLists}
                  lists={lists}
                />
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
                onSave={() => {
                  saveListsToWorkspace(lists)
                }}
                setList={list => {
                  let isNewList = true
                  lists.forEach(item => {
                    if (list.id === item.id) {
                      Object.assign(item, list)
                      isNewList = false
                    }
                  })
                  if (isNewList) {
                    setLists([...lists, list])
                  }
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
    </WorkspaceContext.Provider>
  )
}
