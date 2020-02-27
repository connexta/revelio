import React, { useState } from 'react'

import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'

import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import {
  IndexCards,
  IndexCardItem,
  AddCardItem,
  DeleteAction,
  ShareAction,
  DuplicateAction,
  Actions,
} from '../index-cards'

import { InlineRetry, SnackbarRetry } from '../network-retry'
import { Link, useParams, Redirect } from 'react-router-dom'

import { useQueryExecutor } from '../../react-hooks'

import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

import QueryStatus from '../query-status'
import BasicSearch from '../basic-search'
import {
  toFilterTree,
  fromFilterTree,
  populateDefaultQuery,
} from '../basic-search/basic-search-helper'
import QuerySelector from '../query-selector'

import Lists from '../lists'
import { getIn } from 'immutable'
import loadable from 'react-loadable'
import { clone } from '@turf/turf'
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
    return <InlineRetry error={error}>Error Retrieving Workspace</InlineRetry>
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
                  key={metacard.attributes.id}
                  title={metacard.attributes.title}
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

const Workspaces = props => {
  const { workspaces, onCreate, onDelete, onDuplicate } = props

  return (
    <IndexCards>
      <AddCardItem onClick={onCreate} />
      {workspaces.map(workspace => {
        return (
          <Link
            key={workspace.id}
            to={`/workspaces/${workspace.id}`}
            style={{ textDecoration: 'none' }}
          >
            <IndexCardItem {...workspace}>
              <Actions>
                <ShareAction
                  id={workspace.id}
                  title={workspace.title}
                  metacardType="workspace"
                />
                <DeleteAction
                  onDelete={() => onDelete(workspace)}
                  message="This will permanently delete the workspace."
                />
                <DuplicateAction onDuplicate={() => onDuplicate(workspace)} />
              </Actions>
            </IndexCardItem>
          </Link>
        )
      })}
    </IndexCards>
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
const workspaceAttributes = gql`
  fragment WorkspaceAttributes on MetacardAttributes {
    title
    metacard_tags
    metacard_type
  }
`
const useClone = () => {
  const cloneWorkspace = gql`
    mutation CloneWorkspace($id: ID!) {
      cloneMetacard(id: $id) {
        ...WorkspaceAttributes
        id: id
        owner: metacard_owner
        modified: metacard_modified
      }
    }
    ${workspaceAttributes}
  `

  return useMutation(cloneWorkspace, {
    update: (cache, { data }) => {
      const query = workspaces
      const { metacardsByTag } = cache.readQuery({ query })
      const updatedWorkspaces = [
        data.cloneMetacard,
        ...metacardsByTag.attributes,
      ]
      cache.writeQuery({
        query,
        data: {
          metacardsByTag: {
            attributes: updatedWorkspaces,
            __typename: 'QueryResponse',
          },
        },
      })
    },
  })
}

const useCreate = () => {
  const [redirectId, setRedirectId] = React.useState(null)
  const mutation = gql`
    mutation CreateWorkspace($attrs: MetacardAttributesInput!) {
      createMetacard(attrs: $attrs) {
        ...WorkspaceAttributes
        id: id
        owner: metacard_owner
        modified: metacard_modified
      }
    }
    ${workspaceAttributes}
  `

  const [create] = useMutation(mutation, {
    update: (cache, { data }) => {
      const query = workspaces
      const { metacardsByTag } = cache.readQuery({ query })
      const updatedWorkspaces = [
        data.createMetacard,
        ...metacardsByTag.attributes,
      ]
      cache.writeQuery({
        query,
        data: {
          metacardsByTag: {
            attributes: updatedWorkspaces,
            __typename: 'QueryResponse',
          },
        },
      })
      setRedirectId(data.createMetacard.id)
    },
  })
  return [create, redirectId]
}

const useDelete = () => {
  const mutation = gql`
    mutation DeleteWorkspace($id: ID!) {
      deleteMetacard(id: $id)
    }
  `
  return useMutation(mutation, {
    update: (cache, { data }) => {
      const query = workspaces
      const attributes = getIn(
        cache.readQuery({ query }),
        ['metacardsByTag', 'attributes'],
        []
      ).filter(({ id }) => id !== data.deleteMetacard)

      cache.writeQuery({
        query,
        data: {
          metacardsByTag: {
            attributes,
            __typename: 'QueryResponse',
          },
        },
      })
    },
  })
}

export default () => {
  const { refetch, loading, error, data } = useQuery(workspaces)
  const [create, redirectId] = useCreate()
  const [_delete] = useDelete()
  const [_clone] = useClone()

  if (loading) {
    return <LoadingComponent />
  }

  if (error) {
    return (
      <SnackbarRetry
        message={'Issue retrieving workspaces, would you like to retry?'}
        onRetry={refetch}
        error={error}
      />
    )
  }

  if (redirectId) {
    return <Redirect push to={`/workspaces/${redirectId}`} />
  }

  const onCreate = () => {
    create({
      variables: {
        attrs: {
          title: 'New Workspace',
          metacard_type: 'workspace',
          metacard_tags: ['workspace'],
        },
      },
    })
  }

  const onDelete = ({ id }) => {
    _delete({
      variables: {
        id,
      },
    })
  }

  const onDuplicate = ({ id }) => {
    _clone({
      variables: {
        id: id,
      },
    })
  }

  const workspacesSortedByTime = data.metacardsByTag.attributes.sort(
    (a, b) => (a.modified > b.modified ? -1 : 1)
  )
  return (
    <Workspaces
      workspaces={workspacesSortedByTime}
      onCreate={onCreate}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
    />
  )
}
