import { configure } from '@storybook/react'

configure(require.context('../src', true, /\.stories\.(t|j)sx?$/), module)
