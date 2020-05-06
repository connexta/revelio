import React, { useEffect, useState } from 'react'
export const AuthContext = React.createContext({})
import cookies from '../../cookies'

const hasAuthCookie = () => {
  return cookies.get('RSESSION') !== undefined
}

export default ({ children }) => {
  const [authenticated, setAuthenticated] = useState(hasAuthCookie())
  useEffect(() => {
    const onCookieChange = ({ name, value }) => {
      if (name === 'RSESSION') {
        console.log('cookie change:', value)
        setAuthenticated(value !== undefined)
      }
    }
    cookies.addChangeListener(onCookieChange)
    return () => {
      cookies.removeChangeListener(onCookieChange)
    }
  }, [])

  return (
    <AuthContext.Provider value={authenticated}>
      {children}
    </AuthContext.Provider>
  )
}
