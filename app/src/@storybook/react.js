import { withInfo } from '@storybook/addon-info'
import withTheme from './with-theme'
import withDrawProvider from './with-draw-provider'
import withMuiPickersProvider from './with-mui-pickers-provider'
import { storiesOf as of } from '@storybook/react'
export const storiesOf = (name, m) => {
  const stories = of(name, m)
  stories.addDecorator(withInfo)
  stories.addDecorator(withTheme)
  stories.addDecorator(withDrawProvider)
  stories.addDecorator(withMuiPickersProvider)
  return stories
}
