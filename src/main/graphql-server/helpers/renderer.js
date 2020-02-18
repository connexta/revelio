import RevelioRoutes, { hasPath } from '../../webapp/routes'
import executeSSR from './execute-ssr'
const ROOT_PATH = '/search/catalog'
import { makeExecutableSchema } from 'graphql-tools'
import schema from '../../webapp/intrigue-api/schema'
const { resolvers, typeDefs, context } = schema

const executableSchema = makeExecutableSchema({ typeDefs, resolvers })
export default async (req, res, next) => {
  const path = req.originalUrl.replace(ROOT_PATH, '')
  try {
    if (hasPath(path)) {
      const html = await executeSSR({
        Routes: RevelioRoutes,
        executableSchema,
        context,
      })(req)
      res.end(html)
    } else {
      next()
    }
  } catch (e) {
    //eslint-disable-next-line
    console.error(e)
    res.status(500)
    res.end(e.message)
  }
}
