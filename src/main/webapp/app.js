import React from 'react'
import Routes from './routes'
import { BrowserRouter } from 'react-router-dom'
import { createClientApollo } from './intrigue-api/graphql'
import { ApolloProvider } from '@apollo/react-hooks'
import Loadable from 'react-loadable'
import { LogInModal } from './login/loginModal'

const render = async (Routes, client) => {
  // TODO: Update render to be hydrate to improve performance
  await Loadable.preloadReady()
  ReactDOM.render(
    <Application Routes={Routes} client={client} />,
    document.getElementById('root')
  )
}

const Application = ({ Routes, client }) => {
  const [showLogin, setShowLogIn] = React.useState(false)
  const client = createClientApollo({
    onAuthentication: tryLogIn => {
      setShowLogIn(tryLogIn)
    },
  })
  React.useEffect(() => {
    const ssrStyles = document.querySelector('#css-server-side')
    if (ssrStyles) {
      ssrStyles.parentNode.removeChild(ssrStyles)
    }
  }, [])
  return (
    <ApolloProvider client={client}>
      <BrowserRouter basename="/search/catalog">
        <div>
          <Routes />
          {showLogin ? (
            <LogInModal open={true} handleClose={() => setShowLogIn(false)} />
          ) : null}
        </div>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
