const createMetacardsResolver = require('./metacards/metacards')
const location = require('./location/location')
const user = require('./user/user')
const sources = require('./sources/sources')
const metacardTypes = require('./metacard-types/metacard-types')
const systemProperties = require('./system-properties/system-properties')
const login = require('./login/login')
const { base } = require('./schema')
export {
  base,
  createMetacardsResolver,
  location,
  user,
  sources,
  metacardTypes,
  systemProperties,
  login,
}
