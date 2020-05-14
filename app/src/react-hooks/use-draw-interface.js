import React, { useState, useContext } from 'react'

const DrawContext = React.createContext()

export const DrawProvider = ({ children }) => {
  const value = useState({
    geo: null,
    active: false,
    shape: 'Polygon',
  })

  return <DrawContext.Provider value={value}>{children}</DrawContext.Provider>
}

export default () => useContext(DrawContext)
