import config from './config.json'
import configUi from './configUi.json'

const responseTable = {
  './internal/config': config,
  './internal/platform/config/ui': configUi,
}

const sleep = timeout =>
  new Promise(resolve => {
    setTimeout(resolve, timeout)
  })

export default async url => {
  await sleep(1000)

  if (Math.random() < 0.1) {
    throw new Error('API failure')
  }

  const response = responseTable[url]

  return response
}
