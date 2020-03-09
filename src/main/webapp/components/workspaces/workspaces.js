import { useMutation, useQuery } from '@apollo/react-hooks'
import Divider from '@material-ui/core/Divider'
import LinearProgress from '@material-ui/core/LinearProgress'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import gql from 'graphql-tag'
import { getIn } from 'immutable'
import React, { useState } from 'react'
import loadable from 'react-loadable'
import { useParams, useHistory } from 'react-router-dom'
import { useQueryExecutor } from '../../react-hooks'
import { Notification } from '../notification/notification'
import Subscribe from './subscribe'
const {
  isWritable,
  isAdmin,
  isReadOnly,
  getSecurityAttributesFromMetacard,
} = require('../sharing/sharing-utils')

import {
  Actions,
  AddCardItem,
  DeleteAction,
  IndexCardItem,
  IndexCards,
  ShareAction,
  DuplicateAction,
  ReadOnly,
} from '../index-cards'
import Lists from '../lists'
import { InlineRetry, SnackbarRetry } from '../network-retry'
import QueryEditor from '../query-editor'
import QuerySelector from '../query-selector'
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

const subscribeMutation = gql`
  mutation Subscribe($id: ID!) {
    subscribeToWorkspace(id: $id)
  }
`

const unsubscribeMutation = gql`
  mutation Unsubscribe($id: ID!) {
    unsubscribeFromWorkspace(id: $id)
  }
`

const Workspaces = props => {
  const { workspaces, onCreate, onDelete, onDuplicate, userAttrs } = props
  const [subscribe] = useMutation(subscribeMutation)
  const [unsubscribe] = useMutation(unsubscribeMutation)
  const [message, setMessage] = React.useState(null)
  const history = useHistory()

  return (
    <IndexCards>
      {message ? (
        <Notification
          message={message}
          onClose={() => {
            setMessage(null)
          }}
        />
      ) : null}
      <AddCardItem onClick={onCreate} />
      {workspaces.map(workspace => {
        const isSubscribed = workspace.userIsSubscribed
        workspace = workspace.attributes
        const securityAttributes = getSecurityAttributesFromMetacard(workspace)
        const canShare = isAdmin(
          userAttrs.email,
          securityAttributes,
          workspace.owner
        )
        const canWrite = isWritable(
          userAttrs.email,
          userAttrs.roles,
          securityAttributes,
          canShare
        )
        const readOnly = isReadOnly(
          canWrite,
          canShare,
          securityAttributes,
          userAttrs.email,
          userAttrs.roles
        )
        return (
          <IndexCardItem
            {...workspace}
            key={workspace.id}
            onClick={() => history.push(`/workspaces/${workspace.id}`)}
          >
            <Actions>
              <ShareAction
                id={workspace.id}
                title={workspace.title}
                metacardType="workspace"
                isAdmin={canShare}
              />
              <DeleteAction
                onDelete={() => onDelete(workspace)}
                message="This will permanently delete the workspace."
                isWritable={canWrite}
              />
              <Subscribe
                subscribe={subscribe}
                unsubscribe={unsubscribe}
                id={workspace.id}
                title={workspace.title}
                setMessage={setMessage}
                isSubscribed={isSubscribed}
              />
              <DuplicateAction onDuplicate={() => onDuplicate(workspace)} />
              <ReadOnly isReadOnly={readOnly} indexCardType="workspace" />
            </Actions>
          </IndexCardItem>
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
        metacard_owner
        security_access_individuals_read
        security_access_individuals
        security_access_administrators
        security_access_groups_read
        security_access_groups
        modified: metacard_modified
      }
      results {
        isSubscribed
        id
      }
    }
    user {
      email
      roles
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

const securityAttributes = [
  'security_access_individuals_read',
  'security_access_individuals',
  'security_access_groups_read',
  'security_access_groups',
]
const useCreate = () => {
  const history = useHistory()
  const mutation = gql`
    mutation CreateWorkspace($attrs: MetacardAttributesInput!) {
      createMetacard(attrs: $attrs) {
        ...WorkspaceAttributes
        security_access_administrators
        id: id
        metacard_owner
        modified: metacard_modified
      }
    }
    ${workspaceAttributes}
  `

  return useMutation(mutation, {
    update: (cache, { data }) => {
      const query = workspaces
      const { metacardsByTag, user } = cache.readQuery({ query })
      securityAttributes.forEach(securityAttr => {
        data.createMetacard[securityAttr] = []
      })
      const updatedWorkspaces = [
        data.createMetacard,
        ...metacardsByTag.attributes,
      ]
      const updatedResults = [
        {
          id: data.createMetacard.id,
          isSubscribed: false,
          __typename: 'QueryResponse',
        },
        ...metacardsByTag.results,
      ]
      const { email, roles } = user
      cache.writeQuery({
        query,
        data: {
          metacardsByTag: {
            attributes: updatedWorkspaces,
            results: updatedResults,
            __typename: 'QueryResponse',
          },
          user: {
            email,
            roles,
            __typename: 'User',
          },
        },
      })

      history.push(`/workspaces/${data.createMetacard.id}`)
    },
  })
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
      const results = getIn(
        cache.readQuery({ query }),
        ['metacardsByTag', 'results'],
        []
      ).filter(({ id }) => id !== data.deleteMetacard)

      cache.writeQuery({
        query,
        data: {
          metacardsByTag: {
            attributes,
            results,
            __typename: 'QueryResponse',
          },
        },
      })
    },
  })
}

export default () => {
  const { refetch, loading, error, data } = useQuery(workspaces)
  const [create] = useCreate()
  const [_delete] = useDelete()
  const [clone] = useClone()

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
    clone({
      variables: {
        id: id,
      },
    })
  }

  const workspacesWithSubscriptions = data.metacardsByTag.attributes.map(
    (metacard, index) => {
      return {
        attributes: metacard,
        userIsSubscribed: data.metacardsByTag.results[index].isSubscribed,
      }
    }
  )
  const workspacesSortedByTime = workspacesWithSubscriptions.sort(
    (a, b) => (a.attributes.modified > b.attributes.modified ? -1 : 1)
  )
  return (
    <Workspaces
      workspaces={workspacesSortedByTime}
      onCreate={onCreate}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
      userAttrs={data.user}
    />
  )
}
