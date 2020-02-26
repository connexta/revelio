import * as React from 'react'
const { DrawProvider } = require('../react-hooks/use-draw-interface')

const withDrawProvider = (Story: any) => {
  return (
    <DrawProvider>
      <Story />
    </DrawProvider>
  )
}

export default withDrawProvider
