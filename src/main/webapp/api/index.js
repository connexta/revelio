import config from './config.json'
import configUi from './configUi.json'
import randomize from './random'

const responseTable = {
  './internal/config': config,
  './internal/platform/config/ui': configUi,
}

export default async url => {
  await randomize()

  const response = responseTable[url]

  return response
}
