const config = require('../config')

module.exports = {
  plugin: require('hapi-pino'),
  options: {
    logPayload: true,
    prettyPrint: config.isLocal,
    level: config.isLocal ? 'debug' : 'warn'
  }
}
