import config from './config.json'
import configUi from './configUi.json'
import { resolve } from 'url'

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
  const response = responseTable[url]

  return response
}
