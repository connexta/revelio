import context from './context'
import mergeModules from './merge-modules'
import typeDefs from './base-typedefs'

export default [
  { resolvers: {}, typeDefs, context },
  require('./metacards/metacards')(),
  require('./location/location'),
  require('./user/user'),
  require('./sources/sources'),
  require('./metacard-types/metacard-types'),
  require('./system-properties/system-properties'),
  require('./login/login'),
].reduce(mergeModules)
