import React, { useState, useContext } from 'react'
import { shapes } from 'geospatialdraw'

const DrawContext = React.createContext()

export const DrawProvider = ({ children }) => {
  const value = useState({
    geo: null,
    active: false,
    shape: shapes.POLYGON,
  })

  return <DrawContext.Provider value={value}>{children}</DrawContext.Provider>
}

export default () => useContext(DrawContext)
