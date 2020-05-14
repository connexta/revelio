import { useApolloClient } from '@apollo/react-hooks'

const useApolloFallback = (container, component) => {
  try {
    useApolloClient()
    return container
  } catch (e) {
    return component
  }
}

export default useApolloFallback
