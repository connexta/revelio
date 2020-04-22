import { onError } from 'apollo-link-error'

const authenticationLink = onAuthentication =>
  onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.extensions.code === 'UNAUTHENTICATED') {
          onAuthentication(() => {
            forward(operation, graphQLErrors)
          })
        }
      }
    }
    if (networkError) {
      return forward(networkError, operation)
    }
  })

export default authenticationLink
