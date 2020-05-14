import { useQuery } from '@apollo/react-hooks'
import Divider from '@material-ui/core/Divider'
import LinearProgress from '@material-ui/core/LinearProgress'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { WorkspaceContext } from './workspace-context'
import { useQueryExecutor } from '../../react-hooks'
import { IndexCardItem } from '../index-cards'
import Lists from '../lists'
import { InlineRetry } from '../network-retry'
import QueryEditor from '../query-editor'
import QueryManager, { AddQuery, CreateSearch } from '../query-manager'
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
import dynamic from 'next/dynamic'
import Filters from './filters'
import { defaultQuery } from '../query-builder/filter/filter-utils'
import Pagination from './pagination'
import { useUserPrefs } from '../../react-hooks'
import Box from '@material-ui/core/Box'

const LoadingComponent = () => <LinearProgress />

const Visualizations = dynamic(() => import('../visualizations'), {
  ssr: false,
  loading: LoadingComponent,
})

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

const queryToSearch = (query, options = {}) => {
  const { sources, sorts, detail_level, filterTree } = query
  const { resultCountOnly, startIndex, pageSize } = options

  const pagingFields = {
    startIndex,
    pageSize: resultCountOnly ? 0 : pageSize,
  }
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
    ...pagingFields,
    detail_level: detail_level === 'All Fields' ? undefined : detail_level,
  }
}
const addFiltersToQuery = (query, filters) => {
  const { filterTree } = query

  const searchTree = !filterTree ? defaultQuery : filterTree
  const newFilterTree = {
    ...searchTree,
    filters: [...searchTree.filters, ...filters],
  }
  return { ...query, filterTree: newFilterTree }
}

export default props => {
  const { id } = props
  const [listResults, setListResults] = useState([])
  const [currentQuery, setCurrentQuery] = useState(null)
  const [lists, setLists] = useState(null)
  const [queries, setQueries] = useState()
  const [filters, setFilters] = useState()
  const [tab, setTab] = useState(0)
  const [page, setPage] = useState(1)

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
  const [saveWorkspace, saving] = useSaveWorkspace(id)

  const [userPrefs] = useUserPrefs()
  const pageSize = get(userPrefs, 'resultCount', 0)
  const createQuery = useCreateQuery(query => {
    onClear()
    setQueries([query, ...queries])
    setCurrentQuery(query.id)
    saveWorkspace({ queries: [query, ...queries] })
    onSearch(queryToSearch(query, { pageSize }))
    setTab(0)
    setPage(1)
  })

  //eslint-disable-next-line no-unused-vars
  const saveListsToWorkspace = lists => {
    // TO-DO Implement save functionality
    // saveWorkspace({ lists })
  }

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

  const onSearchQuery = (id, options = { pageSize }) => {
    const query = queries.find(query => query.id === id)
    const queryWithFilters = addFiltersToQuery(query, filters)

    onClear()
    setCurrentQuery(id)
    onSearch(queryToSearch(queryWithFilters, options))
    setPage(options.page ? options.page : 1)
  }

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
            display: 'flex',
            flexDirection: 'column',
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
          <AddQuery
            QueryEditor={QueryEditor}
            onCreate={createQuery}
            render={handleOpen => {
              const shouldRender = tab === 0 && queries && queries.length === 0
              return shouldRender && <CreateSearch handleOpen={handleOpen} />
            }}
          />
          {tab === 0 && queries && (
            <React.Fragment>
              <QueryManager
                QueryEditor={QueryEditor}
                queries={queries}
                currentQuery={currentQuery}
                onSearch={onSearchQuery}
                onCreate={createQuery}
                onDelete={deleteQuery}
                onSave={id => {
                  saveQuery(queries.find(query => query.id === id))
                }}
                onChange={queries => setQueries(queries)}
              />
              {Object.keys(status).length !== 0 ? <Divider /> : null}
              <QueryStatus
                sources={status}
                onRun={sources => {
                  //setPageIndex(0)
                  const searchQuery = queries.find(
                    query => query.id === currentQuery
                  )
                  const queryWithFilters = addFiltersToQuery(
                    searchQuery,
                    filters
                  )
                  onSearch(
                    queryToSearch({
                      ...queryWithFilters,
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

              {Object.keys(status).length !== 0 ? <Divider /> : null}
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexGrow: 1,
                  maxHeight: 'calc(53vh - 32px)',
                }}
              >
                <Box style={{ flexGrow: 1, overflowY: 'auto' }}>
                  <Filters
                    onApply={() => onSearchQuery(currentQuery)}
                    onChange={filters => setFilters(filters)}
                  />
                  <ResultIndexCards
                    results={results}
                    setLists={setLists}
                    lists={lists}
                  />
                </Box>

                <Box style={{ flexShrink: 0 }}>
                  {results.length > 0 && (
                    <Pagination
                      page={page}
                      resultCount={
                        Object.keys(status).length !== 0 &&
                        status[Object.keys(status)[0]].info &&
                        status[Object.keys(status)[0]].info.hits
                      }
                      onSelect={options => {
                        onSearchQuery(currentQuery, options)
                      }}
                    />
                  )}
                </Box>
              </Box>
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
