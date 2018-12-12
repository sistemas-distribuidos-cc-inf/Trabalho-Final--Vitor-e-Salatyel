let winston = require('winston')
let formatter = require('winston-console-formatter')

let logger = new winston.Logger({
  level: 'silly',
});

logger.add(winston.transports.Console, formatter.config())

module.exports = logger