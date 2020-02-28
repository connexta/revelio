import { useMutation, useQuery } from '@apollo/react-hooks'
import Divider from '@material-ui/core/Divider'
import LinearProgress from '@material-ui/core/LinearProgress'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import gql from 'graphql-tag'
import Popover from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'
import { getIn } from 'immutable'
import React, { useState } from 'react'
import loadable from 'react-loadable'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import TextField from '@material-ui/core/TextField'
import { Link, Redirect, useParams } from 'react-router-dom'
import { useQueryExecutor } from '../../react-hooks'
import {
  Actions,
  AddCardItem,
  DeleteAction,
  IndexCardItem,
  IndexCards,
  ShareAction,
} from '../index-cards'
import Lists from '../lists'
import { InlineRetry, SnackbarRetry } from '../network-retry'
import QueryEditor from '../query-editor'
import QuerySelector from '../query-selector'
import QueryStatus from '../query-status'
import SearchIcon from '@material-ui/icons/Search'

const LoadingComponent = () => <LinearProgress />

const {
  transformFilterToCQL,
} = require('../../intrigue-api/metacards/CQLUtils')

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
const queryAttributes = gql`
  fragment QueryAttributes on MetacardAttributes {
    title
    cql
    metacard_tags
    metacard_type
  }
`

const useCreateQuery = workspaceId => {
  const [queryId, setQueryId] = React.useState('')
  const mutation = gql`
    mutation CreateQuery($attrs: MetacardAttributesInput!) {
      createMetacard(attrs: $attrs) {
        id: id
        ...QueryAttributes
      }
    }
    ${queryAttributes}
  `

  const saveMutation = gql`
    mutation SaveWorkspace($id: ID!, $attributes: Json!) {
      saveMetacardFromJson(id: $id, attributes: $attributes) {
        ...WorkspaceAttributes
      }
    }
    ${workspaceAttributes}
  `

  const [save] = useMutation(saveMutation)

  const [create] = useMutation(mutation, {
    onCompleted: data => {
      save({
        variables: {
          id: workspaceId,
          attributes: {
            queries: [data.createMetacard.id],
            metacard_type: 'workspace',
          },
        },
        refetchQueries: ['WorkspaceById'],
      }),
        setQueryId(data.createMetacard.id)
    },
  })

  return [create, queryId]
}

const TextSearchForm = props => {
  const [textValue, setTextValue] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [create, queryId] = useCreateQuery(props.workspaceId)
  const { runQuery } = React.useContext(WorkspaceContext)

  const onCreate = async () => {
    const filter = {
      property: 'anyText',
      type: 'ILIKE',
      value: textValue,
    }

    const cql = transformFilterToCQL(filter)
    try {
      await create({
        variables: {
          attrs: {
            title: title,
            cql: cql,
            metacard_tags: ['query'],
            metacard_type: 'metacard.query',
          },
        },
      })
    } catch (err) {
      //eslint-disable-next-line
      console.err('Error creating search or updating workspace: ', err)
    }
  }

  // When the query id actually exists, run it.
  React.useEffect(
    () => {
      if (queryId) {
        // Get query
        runQuery(queryId)
      }
    },
    [queryId, runQuery]
  )

  const onClickSearch = async () => {
    await onCreate(true)
  }

  return (
    <div style={{ padding: '10px' }}>
      <TextField
        style={{ margin: '10px' }}
        variant="outlined"
        value={title}
        label="Search Name"
        onChange={e => setTitle(e.target.value)}
      />
      <br />
      <TextField
        style={{ margin: '10px' }}
        variant="outlined"
        value={textValue}
        label="Search Text"
        onChange={e => setTextValue(e.target.value)}
      />
      <br />
      <Button variant="outlined" color="secondary" onClick={() => onCreate()}>
        <SaveAltIcon />
        Save
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onClickSearch()}
      >
        <SearchIcon />
        Search
      </Button>
    </div>
  )
}

const useOpenClose = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = () => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  return [open, anchorEl, handleClose, handleClick]
}

const EmptySearchCard = props => {
  const [open, anchorEl, handleClose, handleClick] = useOpenClose()
  return (
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <Typography color="textSecondary">
        New searches will appear here
        <br />
        <SearchIcon style={{ fontSize: '9rem' }} />
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Create a Search
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <TextSearchForm workspaceId={props.workspaceId} />
      </Popover>
    </div>
  )
}

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

const WorkspaceContext = React.createContext({
  runQuery: () => {},
})

export const Workspace = () => {
  const { id } = useParams()

  const [listResults, setListResults] = React.useState([])
  const [currentQuery, setCurrentQuery] = useState(null)
  const [queries, setQueries] = useState([])
  const [queryIdToRun, setQueryIdToRun] = useState(null)
  const { results, status, onSearch, onCancel, onClear } = useQueryExecutor()
  const [tab, setTab] = React.useState(0)

  const { loading, error, data } = useQuery(workspaceById, {
    variables: { ids: [id] },
  })

  React.useEffect(
    () => {
      if (data) {
        const queries = data.metacardsById[0].attributes[0].queries
        setQueries(
          queries.map(query => {
            const { cql, __typename, ...rest } = query // eslint-disable-line no-unused-vars
            return rest
          })
        )
        setCurrentQuery(queries[0] ? queries[0].id : null)
      }
    },
    [data]
  )

  React.useEffect(
    () => {
      if (data && queryIdToRun) {
        const queryToRun = data.metacardsById[0].attributes[0].queries.find(
          q => q.id === queryIdToRun
        )
        if (queryToRun !== undefined) {
          onSearch(queryToRun)
        }
      }
    },
    [queryIdToRun, data, onSearch]
  )

  const runQuery = queryId => {
    setQueryIdToRun(queryId)
  }

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
    <WorkspaceContext.Provider value={{ runQuery }}>
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
            (hasQueries ? (
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
            ) : (
              <EmptySearchCard workspaceId={id} />
            ))}

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
    </WorkspaceContext.Provider>
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

const useCreateWorkspace = () => {
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
  const [create, redirectId] = useCreateWorkspace()
  const [_delete] = useDelete()

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
