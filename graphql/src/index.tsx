import express from 'express'
import apolloServer from './apollo-server'
import compression from 'compression'
import config from './configuration'
const app = express()
const port = config('EXPRESS_PORT')

const getBuildInfo = (): Record<string, any> => {
  const exec = require('child_process').execSync
  let commitHash
  let commitDate
  let isDirty = false
  try {
    commitHash = exec('git rev-parse --short HEAD').toString()
    commitDate = exec('git log -1 --pretty=format:%cI').toString()
    isDirty =
      exec('git status').toString().indexOf('working directory clean') === -1
  } catch (e) {
    console.log('Unable to get build info with git.')
  }
  return {
    __COMMIT_HASH__: commitHash,
    __IS_DIRTY__: isDirty,
    __COMMIT_DATE__: commitDate,
  }
}
const setEnvVariables = () => {
  const buildInfo = getBuildInfo()
  Object.keys(buildInfo).forEach((key) => {
    process.env[key] = buildInfo[key]
  })
}
setEnvVariables()

app.use(compression())

app.use('/graphql', apolloServer)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
