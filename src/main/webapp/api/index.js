import config from './config.json'
import configUi from './configUi.json'

const responseTable = {
  './internal/config': config,
  './internal/platform/config/ui': configUi,
}

export default async url => {
  const response = responseTable[url]

  return response
}
