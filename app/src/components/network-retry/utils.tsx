import { ApolloError } from 'apollo-client/errors/ApolloError'

const ignorableStatusCodes = new Set(['UNAUTHENTICATED'])

export const hasIgnorable = (err: ApolloError) => {
  if (err && err.graphQLErrors) {
    return (
      err.graphQLErrors.filter(error => ignorableStatusCodes.has(error.message))
        .length > 0
    )
  }
  return false
}
