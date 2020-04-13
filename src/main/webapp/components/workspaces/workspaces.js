import { useQuery } from '@apollo/react-hooks'
import LinearProgress from '@material-ui/core/LinearProgress'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { workspaces } from '.'
import {
  Actions,
  AddCardItem,
  DeleteAction,
  DuplicateAction,
  IndexCardItem,
  IndexCards,
  ReadOnly,
  ShareAction,
} from '../index-cards'
import {
  MetacardInteractionsDropdown,
  ShareMetacardInteraction,
  ConfirmDeleteMetacardInteraction,
  EditMetacardInteraction,
  DuplicateMetacardInteraction,
} from '../index-cards/metacard-interactions'
import { SnackbarRetry } from '../network-retry'
import { Notification } from '../notification/notification'
import { useClone, useCreate, useDelete, useSubscribe } from './hooks/'
import { SubscribeAction, SubscribeMetacardInteraction } from './subscribe'
import FilterWorkspaces from './filter-workspaces'
const {
  getPermissions,
  getSecurityAttributesFromMetacard,
} = require('../sharing/sharing-utils')

const LoadingComponent = () => <LinearProgress />

const Workspaces = props => {
  const { workspaces, onCreate, onDelete, onDuplicate, userAttributes } = props
  const [subscribe, unsubscribe] = useSubscribe()
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
        const { canShare, canWrite } = getPermissions(
          userAttributes.email,
          userAttributes.roles,
          securityAttributes,
          workspace.owner
        )
        return (
          <IndexCardItem
            {...workspace}
            key={workspace.id}
            onClick={() => history.push(`/workspaces/${workspace.id}`)}
          >
            <Actions attributes={workspace}>
              <ShareAction
                id={workspace.id}
                title={workspace.title}
                metacardType="workspace"
              />
              <DeleteAction
                onDelete={() => onDelete(workspace)}
                itemName="workspace"
              />
              <SubscribeAction
                subscribe={subscribe}
                unsubscribe={unsubscribe}
                id={workspace.id}
                title={workspace.title}
                setMessage={setMessage}
                isSubscribed={isSubscribed}
              />
              <DuplicateAction onDuplicate={() => onDuplicate(workspace)} />
              <ReadOnly indexCardType="workspace" />
              <MetacardInteractionsDropdown>
                <ShareMetacardInteraction
                  id={workspace.id}
                  title={workspace.title}
                  metacardType="workspace"
                  isAdmin={canShare}
                />
                <EditMetacardInteraction
                  itemName="Workspace"
                  onEdit={() => history.push(`/workspaces/${workspace.id}`)}
                />
                <ConfirmDeleteMetacardInteraction
                  itemName="Workspace"
                  onDelete={() => onDelete(workspace)}
                  isWritable={canWrite}
                />
                <DuplicateMetacardInteraction
                  onDuplicate={() => onDuplicate(workspace)}
                  itemName="Workspace"
                />
                <SubscribeMetacardInteraction
                  subscribe={subscribe}
                  unsubscribe={unsubscribe}
                  id={workspace.id}
                  title={workspace.title}
                  setMessage={setMessage}
                  isSubscribed={isSubscribed}
                />
              </MetacardInteractionsDropdown>
            </Actions>
          </IndexCardItem>
        )
      })}
    </IndexCards>
  )
}

export default () => {
  const { refetch, loading, error, data } = useQuery(workspaces)
  const onCreate = useCreate()
  const onDelete = useDelete()
  const onDuplicate = useClone()

  const [filterFunction, setFilterFunction] = useState(() => () => true)
  const onFilter = filter => setFilterFunction(() => filter)

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

  const filteredWorkspaces = workspacesSortedByTime.filter(filterFunction)

  return (
    <React.Fragment>
      <FilterWorkspaces userAttributes={data.user} onFilter={onFilter} />
      <Workspaces
        workspaces={filteredWorkspaces}
        onCreate={onCreate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        userAttributes={data.user}
      />
    </React.Fragment>
  )
}
