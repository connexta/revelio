import { useMutation, useQuery } from '@apollo/react-hooks'
import Divider from '@material-ui/core/Divider'
import LinearProgress from '@material-ui/core/LinearProgress'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import gql from 'graphql-tag'
import { getIn } from 'immutable'
import React, { memo, useState } from 'react'
import loadable from 'react-loadable'
import { Link, Redirect, useParams } from 'react-router-dom'
import ErrorMessage from '../error'
import {
  Actions,
  AddCardItem,
  DeleteAction,
  IndexCardItem,
  IndexCards,
  ShareAction,
} from '../index-cards'
import Lists from '../lists'
import QueryStatus from '../query-status'
import { useQueryExecutor } from '../react-hooks'
import RetryNotification from '../retry/retry'
import QueryEditor from './query-editor'
import QuerySelector from './query-selector'

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

//TODO add paging
const MemoizedResults = ({ results }) =>
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

export const Workspace = () => {
  const { id } = useParams()

  const [listResults, setListResults] = React.useState([])
  const [currentQuery, setCurrentQuery] = useState(null)
  const [queries, setQueries] = useState([])
  const { results, status, onSearch, onCancel, onClear } = useQueryExecutor()

  const [tab, setTab] = React.useState(0)

  const { loading, error, data } = useQuery(workspaceById, {
    variables: { ids: [id] },
    onCompleted: data => {
      const queries = data.metacardsById[0].attributes[0].queries
      setQueries(
        queries.map(query => {
          const { cql, __typename, ...rest } = query // eslint-disable-line no-unused-vars
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
    return <ErrorMessage error={error}>Error Retrieving Workspace</ErrorMessage>
  }

  const attributes = data.metacardsById[0].attributes[0]

  const { title, lists } = attributes
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
              <MemoizedResults results={results} />
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
        <MemoizedVisualizations results={tab === 0 ? results : listResults} />
      </div>
    </div>
  )
}

const Workspaces = props => {
  const { workspaces, onCreate, onDelete } = props

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

  if (loading) {
    return <LoadingComponent />
  }

  if (error) {
    return (
      <RetryNotification
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

  const workspacesSortedByTime = data.metacardsByTag.attributes.sort(
    (a, b) => (a.modified > b.modified ? -1 : 1)
  )
  return (
    <Workspaces
      workspaces={workspacesSortedByTime}
      onCreate={onCreate}
      onDelete={onDelete}
    />
  )
}
