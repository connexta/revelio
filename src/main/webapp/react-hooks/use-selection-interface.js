import React, { useState, useContext } from 'react'
import { Set } from 'immutable'

const SelectionContext = React.createContext([{}, function() {}])

export const SelectionProvider = ({ children }) => {
  const value = useState(Set())

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  )
}

export default () => useContext(SelectionContext)
