import { ApolloServer } from 'apollo-server-express'
import express, {
  Request as ExpressRequest,
  Response,
  NextFunction,
} from 'express'
import { v4 } from 'uuid'
const app = express()
const LOG_LEVEL = 'info'
import { createLogger, format, transports, Logger } from 'winston'
import { schema } from '../api/schema'
import config from '../configuration'
type Request = {
  logger?: Logger
} & ExpressRequest

const rootLogger = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'revelio' },
  transports: [
    process.env.NODE_ENV === 'production'
      ? new transports.Console()
      : new transports.File({ filename: 'target/server.log' }),
  ],
})

const useCorrelationId = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = v4()
  req.logger = rootLogger.child({ correlationId })
  res.header({ 'Revelio-Correlation-Id': correlationId })
  next()
}

app.use(useCorrelationId)
const btoa = (arg: string) => {
  return Buffer.from(arg).toString('base64')
}

const Authorization = 'Basic ' + btoa('admin:admin')

const { typeDefs, resolvers, context } = schema

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    //@ts-ignore
    headers: {
      Authorization,
    },
  },
  context,
})

server.applyMiddleware({
  app,
  path: '/',
  cors: {
    origin: config('WEBAPP_LOCATION'),
    credentials: true,
  },
})

export default app
