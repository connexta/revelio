import context from './context'
import mergeModules from './merge-modules'
import typeDefs from './base-typedefs'
export const schema = [
  { resolvers: {}, typeDefs, context },
  require('./resolvers/metacards/metacards')(),
  require('./resolvers/location/location'),
  require('./resolvers/user/user'),
  require('./resolvers/sources/sources'),
  require('./resolvers/metacard-types/metacard-types'),
  require('./resolvers/system-properties/system-properties'),
  require('./resolvers/login/login'),
].reduce(mergeModules)
