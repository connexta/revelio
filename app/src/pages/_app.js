import React from 'react'
import NextApp from 'next/app'
import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/goldenlayout-light-theme.css'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { withApollo } from '../lib/apollo'
import App from '../components/app'
import AuthProvider from '../components/login/auth-provider'
class CustomApp extends NextApp {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }
  constructor(props) {
    super(props)
  }
  render() {
    const { Component, pageProps } = this.props

    return (
      <AuthProvider>
        <App title={pageProps.title}>
          <Component {...pageProps} />
        </App>
        <style jsx global>
          {`
            body {
              margin: 0px;
              padding: 0px;
            }
          `}
        </style>
      </AuthProvider>
    )
  }
}
export default withApollo({ ssr: true })(CustomApp)
