import React from 'react'
import Routes from './routes'
import { BrowserRouter } from 'react-router-dom'
import createClientApollo from './intrigue-api/create-client-apollo'
import { ApolloProvider } from '@apollo/react-hooks'
import { LogInModal } from './login/loginModal'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const App = () => {
  const [showLogin, setShowLogIn] = React.useState(false)
  const client = createClientApollo({
    onAuthentication: async done => {
      setShowLogIn(true)
      while (showLogin) {
        await sleep(100)
      }
      done()
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
            <LogInModal
              label="Log In"
              open={true}
              handleClose={() => setShowLogIn(false)}
            />
          ) : null}
        </div>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
