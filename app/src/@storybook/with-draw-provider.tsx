import React from 'react'
import { DrawProvider } from '../react-hooks/use-draw-interface'

const withDrawProvider = (Story: any) => {
  return (
    <DrawProvider>
      <Story />
    </DrawProvider>
  )
}

export default withDrawProvider
