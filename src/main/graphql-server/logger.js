const { transports, createLogger, format } = require('winston')
const httpContext = require('express-http-context')

/*
Logging Primer:
    "fatal” (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
    “error” (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
    “warn” (40): A note on something that should probably be looked at by an operator eventually.
    “info” (30): Detail on regular operation.
    “debug” (20): Anything else, i.e. too verbose to be included in “info” level.
    “trace” (10): Logging from external libraries used by your app or very detailed application logging.
*/
const prettyJson = format.printf(info => {
  if (info.message.constructor === Object) {
    info.message = JSON.stringify(info.message, null, 4)
  }
  return `${info.level}\t${info.time}:  ${info.message} ${info.reqId}`
})

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format(info => {
      info.level = '[' + info.level.toUpperCase() + ']'
      info.reqId = httpContext.get('reqId')
        ? `- Request ID: ${httpContext.get('reqId')}`
        : ''
      info.time = new Date().toISOString()
      return info
    })(),
    format.colorize(),
    format.prettyPrint(),
    format.splat(),
    format.simple(),
    format.timestamp(),
    prettyJson
  ),
  transports: [new transports.Console()],
})

logger.fancy = message => JSON.stringify(message, null, 2)

module.exports = logger
