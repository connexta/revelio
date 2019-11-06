import { storiesOf as of } from '@connexta/ace/@storybook/react'

import withTheme from '../theme/with-theme'

export const storiesOf = (name, m) => {
  const stories = of(name, m)
  stories.addDecorator(withTheme)
  return stories
}
