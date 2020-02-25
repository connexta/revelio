import { storiesOf as of } from '@connexta/ace/@storybook/react'

import withTheme from '../theme/with-theme'
import withDrawProvider from '../components/location/with-draw-provider'
import withMuiPickersProvider from '../with-mui-pickers-provider'

export const storiesOf = (name, m) => {
  const stories = of(name, m)
  stories.addDecorator(withTheme)
  stories.addDecorator(withDrawProvider)
  stories.addDecorator(withMuiPickersProvider)
  return stories
}
