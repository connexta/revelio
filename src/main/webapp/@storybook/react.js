import { storiesOf as of } from '@connexta/ace/@storybook/react'

import withTheme from '../theme/with-theme'
import withDrawProvider from '../location/with-draw-provider'

export const storiesOf = (name, m) => {
  const stories = of(name, m)
  stories.addDecorator(withTheme)
  stories.addDecorator(withDrawProvider)
  return stories
}
