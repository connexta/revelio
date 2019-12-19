import React from 'react'
import Routes from './routes'
import { BrowserRouter } from 'react-router-dom'
import { createClientApollo } from './intrigue-api/graphql'
import { ApolloProvider } from '@apollo/react-hooks'
import { LogInModal } from './login/loginModal'

const App = () => {
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
            <LogInModal open={true} label="Log In" handleClose={() => setShowLogIn(false)} />
          ) : null}
        </div>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
